

let width = d3.select("#globe").node().getBoundingClientRect().width;
let height = 1080;
let sensitivity = 40;
let rotationSpeed = 40;
let centered;

let projection = d3.geoOrthographic()
	.clipAngle(90)
	.scale(250)
	.center([0, 0])
	.rotate([0, -30])
	.translate([width/2, height/2]);

let active = d3.select(null);

const initialScale = projection.scale();

let path = d3.geoPath().projection(projection);

let svg = d3.select("#globe")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

let globe = svg.append("circle")
	.attr("fill", "black")
	.attr("stroke", "red")
	.attr("stroke-width", "0.2")
	.attr("cx", width/2)
	.attr("cy", height/2)
	.attr("r", initialScale);

svg.call(d3.drag().on("drag", () =>{
	const rotate = projection.rotate();
	const k = sensitivity / projection.scale();
	projection.rotate([
		rotate[0] + d3.event.dx * k,
		rotate[1] - d3.event.dy * k
		]);
	path = d3.geoPath().projection(projection);
	svg.selectAll("path").attr("d", path);
}))
	.call(d3.zoom().on("zoom", () => {
		if(d3.event.transform.k > 0.3)
		{
			projection.scale(initialScale * d3.event.transform.k);
			path = d3.geoPath().projection(projection);
			svg.selectAll("path").attr("d", path);
			globe.attr("r", projection.scale());
		}
		else
		{
			d3.event.transform.k = 0.3;
		}
		}));


var numberRange = [1000, 5000, 10000, 100000, 500000, 1000000, 5000000, 10000000, 20000000];
var colorRange = ["#380000", "#4c0000", "#5f0000", "#730000", "#860000", "#9a0000", "#ae0000", "#c10000", "#fc0000"];

let map = svg.append("g");

function drawGlobe()
{
	//var color = d3.scaleSequential(d3.interpolateYlOrRd)
	//	.domain(d3.extent(covidData, function(d){ return parseFloat(d.TotalCases) }));

	var color = d3.scaleThreshold()
		.domain(numberRange)
		.range(colorRange);


	d3.json("data/world_countries.json").then(function(mapData, err) {

	mapData = mergeData(mapData, covidData.Countries, "TotalCases");

    map.append("g")
      .attr("class", "countries" )
      .selectAll("path")
      .data(mapData.features)
      .enter().append("path")
      .attr("class", d => "country_" + d.properties.name.replace(" ","_"))
      .attr("d", path)
      .attr("fill", function(d){
      	var value = d.properties.value;
      	if(value != undefined && value != "" && !isNaN(value))
      		return color(value);
      	else 
      		return "#333333";
      })
      .style("stroke", "#CCCC00")
      .style("stroke-width", 0.5)
      .on("mouseover", onMouseover)
      .on("mouseout", onMouseout)
      .on("click", onClick)
  });
}


d3.timer(function(elapsed) {
    const rotate = projection.rotate()
    const k = rotationSpeed / projection.scale()
    projection.rotate([
      rotate[0] - 1 * k,
      rotate[1]
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)

  },200);

function mergeData(set1, set2, column)
{

	for(var i = 0; i < set2.length; i++)
	{
		var dataCountry = set2[i].Country;
		var dataValue = parseFloat(set2[i].TotalConfirmed);


		for(var n = 0; n < set1.features.length; n++)
		{
			var jsonCountry = set1.features[n].properties.name;

			if(jsonCountry == dataCountry)
			{
				set1.features[n].properties.value = dataValue;

				break;
			}
		}
	}

	return set1;
}

//Mouse over map fucntion
function onMouseover(){

	//Select the marked country and increase the opacity
	d3.select(this)
		.transition()
		.duration(200)
		.style("stroke-width", 2);
}

//Reset when mouse out
function onMouseout(){
	d3.select(this)
		.transition()
		.duration(200)
		.style("stroke-width", 0.5);
	
}

function onClick(d) {
	rotationSpeed = 0;
	d3.select(this)
			.transition()
			.duration(200)
			.style("stroke-width", 2);
	setTimeout(() => {rotationSpeed = 40;}, 7000);

	var popup = document.getElementById("myPopup");
  	
  	$(function() {
    	$( "#dialog" ).dialog();
    	$(".tooltip").show(); 
    	// Getter
		var title = $( ".selector" ).dialog( "option", "title" );
		 
		// Setter
		$( "#dialog" ).dialog( "option", "title", d.properties.name );

		var minWidth = $( ".selector" ).dialog( "option", "minWidth" );
 
		// Setter
		$( "#dialog" ).dialog( "option", "minWidth", 400 );

		$('#dialog').on('dialogclose', function(event) {
     		$(".tooltip").hide(); 
 		});

  	});



  	let countryCases = undefined;
  	let countryDeaths = undefined;
  	let countryRecovered = undefined;
  	let date;

  	let countryChangeCases = undefined;
  	let countryChangeDeaths = undefined;
  	let countryChangeRecovered = undefined;

  	for(let i = 0; i < covidData.Countries.length; i++)
  	{
  		if(covidData.Countries[i].Country == d.properties.name)
  		{
  			countryCases = covidData.Countries[i].TotalConfirmed;
  			countryDeaths = covidData.Countries[i].TotalDeaths;
  			countryRecovered = covidData.Countries[i].TotalRecovered;

  			countryChangeCases = covidData.Countries[i].NewConfirmed;
  			countryChangeDeaths = covidData.Countries[i].NewDeaths;
  			countryChangeRecovered = covidData.Countries[i].NewRecovered;
  			
  			drawDonut(covidData.Countries[i].Slug);

  			date = covidData.Countries[i].Date.toLocaleString().replace('Z', ' ').replace('T', ' ');
  			break;
  		}
  		else
  		{
  			d3.selectAll('.donut-svg').remove();
  		}
  	}

  	//document.getElementById("popup-total-cases").innerHTML = numberWithCommas(countryCases) + " (+" + numberWithCommas(countryChangeCases) + ")";

	//document.getElementById("active-cases").innerHTML = activeCases;
	document.getElementById("popup-total-deaths").innerHTML = numberWithCommas(countryDeaths) + " (+" + numberWithCommas(countryChangeDeaths) + ")";
	document.getElementById("popup-total-recovered").innerHTML = numberWithCommas(countryRecovered) + " (+" + numberWithCommas(countryChangeRecovered) + ")";
	document.getElementById("popup-total-cases").innerHTML = numberWithCommas(countryCases) + " (+" + numberWithCommas(countryChangeCases) + ")";
	document.getElementById("popup-date").innerHTML = "Data updated: " +  date;

  	
}