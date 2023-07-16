/**
 * Initialize the DOM
 */
const init = async () => {
  const gdpGrowthRate = await loadGDPGrowthRate('US', 1980, 2020);

  const data = {
    'lastUpdated': gdpGrowthRate[0].lastupdated,
    'type': 'GDP Growth (%)',
    'data': gdpGrowthRate[1]
  };
  
  await drawLineChart(data);
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

/**
 * Draw chart
 */
const drawLineChart = async (wdiData) => {
  const lastUpdated = wdiData.lastUpdated,
    chartType = wdiData.type,
    data = wdiData.data;

  console.log(data);

  var svg = d3.select("#graph"),
    margin = {top: 20, right: 35, bottom: 70, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

  const parseTime = d3.timeParse("%Y");

  const x = d3.scaleTime().range([0, width]).nice().domain(d3.extent(data, d => parseTime(d.date)));
  const y = d3.scaleLinear().rangeRound([height, 0]).domain(d3.extent(data, d => d.value));

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

  // Y - Axis
  g.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))

  // Y - Axis Lable
  g.append("text")
    .style("font-size", "13px")
    .attr("y", 0 - margin.top)
    .attr("x", 0)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("(%)");

  var line = d3.line()
    .defined(d => d.value)
    .x(d => x(parseTime(d.date)))
    .y(d => y(d.value))
    .curve(d3.curveCardinal.tension(0.5));
    // .curve(d3.curveBasis);

  g.append("g")
    .attr("class", "line-group")
    .style("position", "absolute")
    .style("z-index", "2")
    .append("path")
    .datum(data)
    .datum(data.filter(line.defined()))
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

}
