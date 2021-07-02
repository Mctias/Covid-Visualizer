let covidData = [];
let totalDeaths = 0;
let totalCases = 0;
let activeCases = 0;
let totalRecovered = 0;
/*
function loadData()
{
	d3.json('https://api.covid19api.com/summary').then(function(inData, err){

		if(err)
		{
			return console.log(err);
		}
		console.log	(inData.Global.NewConfirmed);
		
		inData.forEach(function(d){
			

			if(d.TotalDeaths)
				totalDeaths += parseFloat(d.TotalDeaths);
			if(d.TotalCases)
				totalCases += parseFloat(d.TotalCases);
			if(d.TotalRecovered)
				totalRecovered += parseFloat(d.TotalRecovered);
			if(d.ActiveCases)
				activeCases += parseFloat(d.ActiveCases);



			covidData.push(d)
		});

		console.log("Data loaded!");
		drawGlobe();
		populateMenu();
		fetchData();

	});
}*/

async function fetchData() {
	const res = await fetch('https://api.covid19api.com/summary');
	covidData = await res.json();

	totalDeaths = covidData.Global.TotalDeaths;
	totalCases = covidData.Global.TotalConfirmed;
	activeCases = covidData.Global.ActiveCases;
	totalRecovered = covidData.Global.TotalRecovered;

	document.getElementById("date-updated").innerHTML += covidData.Global.Date.toLocaleString().replace('Z', ' ').replace('T', ' ');
	
	console.log("Data loaded!");
	populateMenu();
	drawGlobe();
}