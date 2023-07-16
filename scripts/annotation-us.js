// Year	Nominal GDP (trillions)	Real GDP (trillions)	GDP Growth Rate	Events Affecting GDP
// 1984	$4.038	$7.633	7.2%	1980 recession ended
// 1991	$6.158	$9.355	-0.1%	Recession Hit again 1988 Fed raised rates, 1989 S&L Crisis
// 2001	$10.582	$13.262	1.0% Tech bubble burst	9/11 attacks
// 2009	$14.449	$15.209	-2.5%	Bank crisis Financial Crisis
// 2020	$20,893	$18,384	-3.4%	Covid-19 pandemic
const annotations = [
  {
    note: {
      label: "in hendrerit gravida rutrum quisque non tellus orci ac auctor augue mauris augue neque gravida",
      title: "egestas maecenas pharetra convallis",
      wrap: 190,
      align: "left"
    },
    x: 167,
    y: 50,
    dy: 30,
    dx: 60
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      label: "in hendrerit gravida rutrum quisque non tellus orci ac auctor augue mauris augue neque gravida",
      title: "egestas maecenas pharetra convallis",
      wrap: 190
    },
    subject: {
      radius: 50
    },
    x: 280,
    y: 580,
    dy: 1,
    dx: 130
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      label: "in hendrerit gravida rutrum quisque non tellus orci ac auctor augue mauris augue neque gravida",
      title: "egestas maecenas pharetra convallis",
      wrap: 170
    },
    subject: {
      radius: 40
    },
    x: 825,
    y: 350,
    dy: 30,
    dx: -60
  }].map(function(d) { d.color = "#990000"; return d })
