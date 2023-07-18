# Economic Symphony

## Definition

**Title:** "Economic Symphony: A Visual Journey of GDP, Inflation, and Interest Rates"

**Synopsis:**
"Economic Symphony" is a narrative visualization that takes viewers on a captivating journey through the interconnected dynamics of GDP, inflation, and interest rates. Through a combination of interactive visualizations, storytelling, and data exploration, the project aims to provide a historical understanding of the relationship between these economic indicators and their impact on various aspects of society.

## Review Criteria

### Messaging

> What is the message you are trying to communicate with the narrative visualization?
> 

The message conveyed through the "Economic Symphony" narrative visualization is to provide a deeper understanding of the complex interplay between GDP, inflation, and interest rates and their impact on various economic phenomena, events, and societal outcomes. By immersing viewers in an engaging and interactive visual journey, the visualization aims to shed light on the dynamic relationships and patterns within the economic landscape, fostering comprehension of how economic indicators influence each other and shape the overall health and performance of an economy. The visualization seeks to empower users to explore, analyze, and uncover insights from the data, enabling them to make more informed decisions and gain a greater appreciation of the multifaceted nature of the economy.

### Narrative Structure

> Which structure was your narrative visualization designed to follow (martini glass, interactive slide show or drop-down story)? How does your narrative visualization follow that structure? (All of these structures can include the opportunity to "drill-down" and explore. The difference is where that opportunity happens in the structure.)
> 

The Interactive Slideshow structure was employed in the narrative visualization. Three scenes were incorporated to display line charts depicting the GDP, Inflation Rate, and Interest Rate of the United States, India, and the United Kingdom. The final scene of the visualization offers options for viewers to navigate through the data of different countries. Each scene enables users to filter records using start year and end year controls.

### Visual Structure

> What visual structure is used for each scene? How does it ensure the viewer can understand the data and navigate the scene? How does it highlight to urge the viewer to focus on the important parts of the data in each scene? How does it help the viewer transition to other scenes, to understand how the data connects to the data in other scenes?
> 

The Economy Symphony visualization displays line charts of GDP, Inflation Rate, and Interest Rate for the United States, India, and the United Kingdom. Users can filter records by start and end year, and navigate through data of different countries through changing scenes.

### Scenes

> What are the scenes of your narrative visualization? How are the scenes ordered, and why
> 

Three scenes were incorporated to display line charts depicting the GDP, Inflation Rate, and Interest Rate of the United States, India, and the United Kingdom. The final scene of the visualization offers options for viewers to navigate through the data of different countries.

### Annotations

> What template was followed for the annotations, and why that template? How are the annotations used to support the messaging? Do the annotations change within a single scene, and if so, how and why
> 

The major economic events for the United States, India, and United Kingdom are annotated using the d3-annotation library.

### Parameters

> What are the parameters of the narrative visualization? What are the states of the narrative visualization? How are the parameters used to define the state and each scene?
> 

Each scene enables users to filter records using start year and end year controls.

### Triggers

> What are the triggers that connect user actions to changes of state in the narrative visualization? What affordances are provided to the user to communicate to them what options are available to them in the narrative visualization?
> 

The scene navigation bar triggers a change to different scenes, including United States, India, UK, and other countries. The final scene of the visualization offers options for viewers to navigate through the data of countries outside of the US, India, and UK.

Each scene has a start year and an end year. These controls trigger a re-rendering of graphs based on filtered year spans.

## Data Sources

1. GDP growth rate: [GDP growth (annual %) | Data (worldbank.org)](https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG) This indicator measures the percentage change in GDP over a specific period, typically on an annual basis. It helps understand the rate of economic growth or contraction.
2. Inflation: Inflation rate: [Inflation, consumer prices (annual %) | Data (worldbank.org)](https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG) The inflation rate calculates the percentage change in consumer prices over a specific period. It helps gauge the rate of inflation and its impact on purchasing power.
3. Lending Rates: These rates reflect the interest rates charged by commercial banks for lending. They can provide insights into borrowing costs for businesses and individuals.
4. Major historical financial events are extracts from online articles
    1. USA - [U.S. GDP by Year, Compared to Recessions and Events](https://www.thebalancemoney.com/us-gdp-by-year-3305543)
    2. India - [A short history of India economy | Mint.com](https://www.livemint.com/news/india/a-short-history-of-indian-economy-1947-2019-tryst-with-destiny-other-stories-1565801528109.html)
    3. United Kingdom - [GDP and events in history: how the COVID-19 pandemic shocked the UK economy](https://www.ons.gov.uk/economy/grossdomesticproductgdp/articles/gdpandeventsinhistoryhowthecovid19pandemicshockedtheukeconomy/2022-05-24)
