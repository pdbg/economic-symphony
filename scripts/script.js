/**
 * Initialize the DOM
 */
const init = () => {
  console.log("Hello World!");
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
