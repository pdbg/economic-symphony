const COUNTRIES = [
  { "code": "AF", "name": "Afghanistan" },
  { "code": "AE", "name": "United Arab Emirates" },
  { "code": "AR", "name": "Argentina" },
  { "code": "AU", "name": "Australia" },
  { "code": "AT", "name": "Austria" },
  { "code": "BE", "name": "Belgium" },
  { "code": "BD", "name": "Bangladesh" },
  { "code": "BY", "name": "Belarus" },
  { "code": "BZ", "name": "Belize" },
  { "code": "BM", "name": "Bermuda" },
  { "code": "BR", "name": "Brazil" },
  { "code": "BT", "name": "Bhutan" },
  { "code": "CA", "name": "Canada" },
  { "code": "CH", "name": "Switzerland" },
  { "code": "CL", "name": "Chile" },
  { "code": "CN", "name": "China" },
  { "code": "CM", "name": "Cameroon" },
  { "code": "CO", "name": "Colombia" },
  { "code": "CR", "name": "Costa Rica" },
  { "code": "CU", "name": "Cuba" },
  { "code": "CZ", "name": "Czechia" },
  { "code": "DE", "name": "Germany" },
  { "code": "DK", "name": "Denmark" },
  { "code": "DZ", "name": "Algeria" },
  { "code": "ES", "name": "Spain" },
  { "code": "FI", "name": "Finland" },
  { "code": "FR", "name": "France" },
  { "code": "GN", "name": "Guinea" },
  { "code": "GR", "name": "Greece" },
  { "code": "GL", "name": "Greenland" },
  { "code": "HU", "name": "Hungary" },
  { "code": "IE", "name": "Ireland" },
  { "code": "IQ", "name": "Iraq" },
  { "code": "IS", "name": "Iceland" },
  { "code": "IL", "name": "Israel" },
  { "code": "IT", "name": "Italy" },
  { "code": "JM", "name": "Jamaica" },
  { "code": "JP", "name": "Japan" },
  { "code": "KE", "name": "Kenya" },
  { "code": "KW", "name": "Kuwait" },
  { "code": "LY", "name": "Libya" },
  { "code": "LK", "name": "Sri Lanka" },
  { "code": "MX", "name": "Mexico" },
  { "code": "MM", "name": "Myanmar" },
  { "code": "MN", "name": "Mongolia" },
  { "code": "MU", "name": "Mauritius" },
  { "code": "MY", "name": "Malaysia" },
  { "code": "NG", "name": "Nigeria" },
  { "code": "NL", "name": "Netherlands" },
  { "code": "NO", "name": "Norway" },
  { "code": "NP", "name": "Nepal" },
  { "code": "NZ", "name": "New Zealand" },
  { "code": "OM", "name": "Oman" },
  { "code": "PK", "name": "Pakistan" },
  { "code": "PH", "name": "Philippines" },
  { "code": "PL", "name": "Poland" },
  { "code": "PT", "name": "Portugal" },
  { "code": "PY", "name": "Paraguay" },
  { "code": "QA", "name": "Qatar" },
  { "code": "RU", "name": "Russian Federation" },
  { "code": "SG", "name": "Singapore" },
  { "code": "SK", "name": "Slovak Republic" },
  { "code": "SI", "name": "Slovenia" },
  { "code": "SE", "name": "Sweden" },
  { "code": "SC", "name": "Seychelles" },
  { "code": "TH", "name": "Thailand" },
  { "code": "TW", "name": "Taiwan, China" },
  { "code": "TZ", "name": "Tanzania" },
  { "code": "UG", "name": "Uganda" },
  { "code": "UA", "name": "Ukraine" },
  { "code": "ZM", "name": "Zambia" },
  { "code": "ZW", "name": "Zimbabwe" }
];

const loadCountries = async () => {
  const select = d3.select("#country-filter");

  select.html('');

  select.selectAll("options")
    .data(COUNTRIES)
    .enter()
    .append("option")
    .attr("value", d => d.code)
    .text(d => d.name);

  d3.select("#country-filter").on("change", fetchDataAndDrawChart);
};

