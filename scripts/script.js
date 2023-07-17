/**
 * Initialize the DOM
 */
const init = async () => {
  await fetchDataAndDrawChart();

  d3.select("#country-filter").on("change", fetchDataAndDrawChart);
  d3.select("#start-year").on("change", fetchDataAndDrawChart);
  d3.select("#end-year").on("change", fetchDataAndDrawChart);
};

/**
 * Fetches data from wdi.worldbank.com and renders the chart
 */
const fetchDataAndDrawChart = async () => {
  const countryCode = d3.select("#country-filter").property("value");
  const startYear = d3.select("#start-year").property("value");
  const endYear = d3.select("#end-year").property("value");
  const data = await loadData(countryCode, startYear, endYear);

  drawChart(data);
};

/**
 * Gets the GDP Growth Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadGDPGrowthRate = async (countryCode) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=100`)
};

/**
 * Gets the Inflation Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadInflationRate = async (countryCode) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=100`)
};

/**
 * Gets the Inflation Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadInterestRate = async (countryCode) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/FR.INR.LEND?format=json&per_page=100`)
};

var WDI_DATA;

/**
 * Loads Data from cache if available or hits to server
 */
const loadData = async (countryCode, startYear, endYear) => {
  if (WDI_DATA == undefined) {
    WDI_DATA = await loadAllData(countryCode);
  }

  return {
    'lastUpdated': WDI_DATA.lastUpdated,
    'data': d3.filter(WDI_DATA.data, d => d.date >= startYear && d.date <= endYear),
  }
};

const loadAllData = async (countryCode) => {
  const gdpGrowthRate = await loadGDPGrowthRate(countryCode);
  const inflationRate = await loadInflationRate(countryCode);
  const interestRate = await loadInterestRate(countryCode);

  const data = {};
  gdpGrowthRate[1].forEach(e => {
    data[e.date] = {
      'date': e.date,
      'gdp': e.value,
    }
  });
  inflationRate[1].forEach(e => {
    if (e.date in data) {
      data[e.date]['inflation'] = e.value;
    } else {
      data[e.date] = {
        'date': e.date,
        'gdp': undefined,
        'inflation': e.value,
      }
    }
  });
  interestRate[1].forEach(e => {
    if (e.date in data) {
      data[e.date]['interest'] = e.value;
    } else {
      data[e.date] = {
        'date': e.date,
        'gdp': undefined,
        'inflation': undefined,
        'interest': e.value,
      }
    }
  });

  return {
    'lastUpdated': d3.min([
      gdpGrowthRate[0].lastupdated,
      inflationRate[0].lastupdated,
      interestRate[0].lastupdated
    ]),
    'data': Object.values(data),
  };
};

/**
 * Draw chart
 */
const drawChart = async (wdiData) => {
  const lastUpdated = wdiData.lastUpdated,
    data = wdiData.data;

  console.log(data);

  const minYear = d3.min(data, d => Number(d.date)),
        maxYear = d3.max(data, d => Number(d.date));

  var svg = d3.select("#graph"),
    margin = {top: 20, right: 35, bottom: 70, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  svg.html('');

  const parseTime = d3.timeParse("%Y");

  const x = d3.scaleTime().range([0, width]).nice()
    .domain(d3.extent(data, d => parseTime(d.date)));
  const x1 = d3.scaleBand().range([0, width]).padding(0.2)
    .domain(data.map(d => parseTime(d.date)));
  const y1 = d3.scaleLinear().rangeRound([height, 0])
    .domain(d3.extent(data, d => d.gdp));
  const y2 = d3.scaleLinear().rangeRound([height, 0])
  .domain(d3.extent([...d3.extent(data, d => d.inflation), ...d3.extent(data, d => d.interest)]));

  // Tooltip
  const tooltipCtr = d3.select("#tooltip-ctr");
  tooltipCtr.html('');
  var tooltip2 = tooltipCtr
    .append("div")
    // .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("font-size", "13px")
    .style("background", "rgba(255, 255, 255, .7)");

  const fmt = n => n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

  const mouseoverTooltip = (event, d) => {
    tooltip2.style("visibility", "visible")
      .html("<strong>" + d.date + "</strong><br>" + "GDP Growth   : " + fmt(d.gdp) + "<br>Inflation Rate: " + fmt(d.inflation) + "<br>Interest Rate : " + fmt(d.interest));
  };

  const mousemoveTooltip = (event) => {
    tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
  };

  const mouseoutTooltip = () => {
    tooltip2.style("visibility", "hidden");
  };

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X - Axis
  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // X - Axis Label
  g.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 35) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "13px")
    .text("Year");

  // Y - Left Axis
  g.append("g")
    .attr("class", "axis")
    .attr("id", "y1-axis")
    .call(d3.axisLeft(y1).tickFormat(d3.format(".2s")))

  // Y - Left Axis Lable
  g.append("text")
    .style("font-size", "13px")
    .attr("y", 0 - margin.top)
    .attr("x", 20)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("GDP Growth (%)");

  // Y - Right Axis
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + width + ",0)")
    .attr("id", "y2-axis")
    .call(d3.axisRight(y2));

  g.append("text")
    .style("font-size", "13px")
    .attr("y", 0 - margin.top)
    .attr("x", width - 40)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Inflation / Interest (%)");

  // Get GDP Growth Line Path
  const line1 = d3.line()
    .defined(d => d.gdp)
    .x(d => x(parseTime(d.date)))
    .y(d => y1(d.gdp))
    .curve(d3.curveCardinal.tension(0.5));

  // Draw GDP Growth Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data)
    .datum(data.filter(line1.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "darkgreen")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line1);

  // Add tooltip to GDP Line
  g.append("g")
    .attr("class", "circle-group")
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", d => x(parseTime(d.date)))
    .attr("cy", d => y1(d.gdp))
    .attr("r", 10)
    .style("opacity", 0)
    .on("mouseover", mouseoverTooltip)
    .on("mousemove", mousemoveTooltip)
    .on("mouseout", mouseoutTooltip);

  // Create the bars
  // g.append("g")
  //   .attr("class", "bar-group")
  //   .selectAll(".bar")
  //   .data(data.gdpGrowthRate.data)
  //   .join("rect")
  //   .attr("class", "bar")
  //   .style("position", "absolute")
  //   .style("z-index", "-1")
  //   .attr("x", d => x1(parseTime(d.date)))
  //   .attr("y", d => y1(d.value))
  //   .attr("width", x1.bandwidth())
  //   //.attr("width", width_1/data.length)
  //   .attr("height", d => height - y1(d.value))
  //   .on("mouseover", function(d) {
  //       tooltip2.style("visibility", "visible")
  //           .html("<strong>" + d.date + "</strong><br>" + "Value: " + d.value + "<br>Rate: " + d.rate)
  //   })
  //   .on("mousemove", function(){ tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  //   .on("mouseout", function(){ tooltip2.style("visibility", "hidden");});

  // Get Inflation Line Path
  const line2 = d3.line()
    .defined(d => d.inflation)
    .x(d => x(parseTime(d.date)))
    .y(d => y2(d.inflation))
    .curve(d3.curveCardinal.tension(0.5));

  // Draw Inflation Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data)
    .datum(data.filter(line2.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line2);

  // Add tooltip to Inflation Line
  g.append("g")
    .attr("class", "circle-group")
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", d => x(parseTime(d.date)))
    .attr("cy", d => y2(d.inflation))
    .attr("r", 10)
    .style("opacity", 0)
    .on("mouseover", mouseoverTooltip)
    .on("mousemove", mousemoveTooltip)
    .on("mouseout", mouseoutTooltip);

  // Get Interest Line Path
  const line3 = d3.line()
    .defined(d => d.interest)
    .x(d => x(parseTime(d.date)))
    .y(d => y2(d.interest))
    .curve(d3.curveCardinal.tension(0.5));

  // Draw Interest Rate Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data)
    .datum(data.filter(line3.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line3);

  // Add tooltip to Inflation Line
  g.append("g")
    .attr("class", "circle-group")
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", d => x(parseTime(d.date)))
    .attr("cy", d => y2(d.interest))
    .attr("r", 10)
    .style("opacity", 0)
    .on("mouseover", mouseoverTooltip)
    .on("mousemove", mousemoveTooltip)
    .on("mouseout", mouseoutTooltip);

  //legends
  g.append("rect").attr("class","legend").attr("x", 660).attr("y",40).attr("width",200).attr("height",40).style("fill", "white").style("fill-opacity","70%");
  g.append("rect").attr("class","legend").attr("x", 670).attr("y",48).attr("width",10).attr("height",2).style("fill","darkgreen");
  g.append("text").attr("class","legend").attr("x", 685).attr("y",50).text("GDP Growth (%)").style("font-size", "12px").attr("alignment-baseline","middle");
  g.append("rect").attr("class","legend").attr("x", 670).attr("y",68).attr("width",10).attr("height",2).style("fill","red");
  g.append("text").attr("class","legend").attr("x", 685).attr("y",70).text("Inflation Rate (%)").style("font-size", "12px").attr("alignment-baseline","middle");
  g.append("rect").attr("class","legend").attr("x", 670).attr("y",88).attr("width",10).attr("height",2).style("fill","orange");
  g.append("text").attr("class","legend").attr("x", 685).attr("y",90).text("Interest Rate (%)").style("font-size", "12px").attr("alignment-baseline","middle");
  g.selectAll(".legend").attr("transform", "translate(-50,0)")

  // Annotations
  if (HISTORICAL_EVENTS != undefined) {
    const annotations = HISTORICAL_EVENTS.filter(d => d.year >= minYear && d.year <= maxYear)
      .map(event => {
        return {
          type: d3.annotationCalloutCircle,
          note: {
            label: '',
            title: event.title,
            wrap: 190
          },
          subject: {
            radius: 20
          },
          x: margin.left + x(parseTime(event.year)),
          y: margin.top + y1(event.gdp),
          dy: 50,
          dx: 50,
          color: "#990000",
        }
    }).map(e => {
      e.dx = (e.x >=width) ? (-e.dx) : e.dx;
      e.dy = (e.y >=height) ? (-e.dy) : e.dy;
      return e;
    });

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations);

    d3.select("#graph")
      .append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
  }
};
