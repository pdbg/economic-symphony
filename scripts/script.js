/**
 * Initialize the DOM
 */
const init = async () => {
  const data = await loadData('US', 1980, 2020);

  drawChart(data);
};

/**
 * Gets the GDP Growth Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadGDPGrowthRate = async (countryCode, yearStart, yearEnd) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=60&date=${yearStart}:${yearEnd}`)
};

/**
 * Gets the Inflation Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadInflationRate = async (countryCode, yearStart, yearEnd) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=60&date=${yearStart}:${yearEnd}`)
};

/**
 * Gets the Inflation Rate Data from Workbank Data
 * @param countryCode country code
 */
const loadInterestRate = async (countryCode, yearStart, yearEnd) => {
  return await d3.json(`https://api.worldbank.org/v2/country/${countryCode}/indicator/FR.INR.LEND?format=json&per_page=60&date=${yearStart}:${yearEnd}`)
};

const loadData = async (countryCode, yearStart, yearEnd) => {
  const gdpGrowthRate = await loadGDPGrowthRate(countryCode, yearStart, yearEnd);
  const inflationRate = await loadInflationRate(countryCode, yearStart, yearEnd);
  const interestRate = await loadInterestRate(countryCode, yearStart, yearEnd);

  return {
    'gdpGrowthRate': {
      'lastUpdated': gdpGrowthRate[0].lastupdated,
      'type': 'GDP Growth (%)',
      'data': gdpGrowthRate[1]
    }, 'inflationRate': {
      'lastUpdated': inflationRate[0].lastupdated,
      'type': 'Inflation Rate (%)',
      'data': inflationRate[1]
    }, 'interestRate': {
      'lastUpdated': interestRate[0].lastupdated,
      'type': 'Interest Rate (%)',
      'data': interestRate[1]
    }
  };
};

/**
 * Draw chart
 */
const drawChart = async (data) => {
  console.log(data);

  var svg = d3.select("#graph"),
    margin = {top: 20, right: 35, bottom: 70, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  const parseTime = d3.timeParse("%Y");

  const x = d3.scaleTime().range([0, width]).nice()
    .domain(d3.extent(data.gdpGrowthRate.data, d => parseTime(d.date)));
  const x1 = d3.scaleBand().range([0, width]).padding(0.2)
    .domain(data.gdpGrowthRate.data.map(d => parseTime(d.date)));
  const y1 = d3.scaleLinear().rangeRound([height, 0])
    .domain(d3.extent(data.gdpGrowthRate.data, d => d.value));
  const y2 = d3.scaleLinear().rangeRound([height, 0])
    .domain(d3.extent([...data.interestRate.data, ...data.inflationRate.data], d => d.value));

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
    .defined(d => d.value)
    .x(d => x(parseTime(d.date)))
    .y(d => y1(d.value))
    .curve(d3.curveCardinal.tension(0.5));

  // Draw GDP Growth Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data.gdpGrowthRate.data)
    .datum(data.gdpGrowthRate.data.filter(line1.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "darkgreen")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line1);

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

  // Get Inflation / Interest Line Path
  const line2 = d3.line()
    .defined(d => d.value)
    .x(d => x(parseTime(d.date)))
    .y(d => y2(d.value))
    .curve(d3.curveCardinal.tension(0.5));

  // Draw Inflation Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data.inflationRate.data)
    .datum(data.inflationRate.data.filter(line2.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line2);

  // Draw Interest Rate Line
  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data.interestRate.data)
    .datum(data.interestRate.data.filter(line2.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line2);

  // Tooltip
  var tooltip2 = d3.select("body")
    .append("div")
    // .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("font-size", "13px")
    .style("background", "rgba(255, 255, 255, .7)");
}
