
async function drawDonut(inData)
{
	d3.selectAll('.donut-svg').remove();

	

	const res = await fetch('https://api.covid19api.com/total/country/' + inData);
	let donutData = await res.json();

	let lastItem = donutData[ Object.keys(donutData).pop() ];

/*
	var data = 
	[
		{
			"name": "active",
			"value": lastItem.Active
		},

		{
			"name": "deaths",
			"value": lastItem.Deaths
		},

		{
			"name": "recovered",
			"value": lastItem.Recovered
		}
	];

*/
	let data = [lastItem.Active, lastItem.Deaths , lastItem.Recovered]

	document.getElementById("popup-active-cases").innerHTML = numberWithCommas(lastItem.Active);

	let width = d3.select("#donut-chart").node().getBoundingClientRect().width ;
		height = 300;
		margin = 20;

	let radius = Math.min(width, height) / 2 - margin;

	let svg = d3.select("#donut-chart")
		.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "donut-svg")
		.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	let color = d3.scaleOrdinal()
		.domain(data)
		.range(["#CCCC00", "#fc0000", "#149414"]);

	let pie = d3.pie()
		.value(function(d) {return d.value;});

	let data_ready = pie(d3.entries(data));

	svg
	  .selectAll('whatever')
	  .data(data_ready)
	  .enter()
	  .append('path')
	  .attr('d', d3.arc()
	    .innerRadius(75)         // This is the size of the donut hole
	    .outerRadius(radius)
	  )
	  .attr('fill', function(d){ return(color(d.value)) })
	  .attr("stroke", "black")
	  .attr('class', 'donut-chart')
	  .style("stroke-width", "2px")
	  .on("mouseover", donutHover)
	  .on("mouseout", donoutMouseOut)

	  function donutHover(d)
	  {
	  	let variable; 
	  	if(color(d.value) =="#CCCC00" )
	  		variable = "Active cases: ";
	  	else if(color(d.value) =="#fc0000")
	  		variable = "Total deaths: ";
	  	else if(color(d.value) =="#149414")
	  		variable = "Total recoveries: ";
	   	
	   	var tooltip = d3.select(".tooltip")
	   		.style("opacity", 0);

	   	tooltip.transition()
	   		.duration(200)
	   		.style("opacity", 0.9);

	   	tooltip.html(variable + " " + d.value)
	   		.style("left", (d3.event.pageX) + "px")
	   		.style("top", (d3.event.pageY - 28) + "px");

	   	d3.select(this)
	   		.transition()
	   		.duration(200)
	   		.style("stroke", "#FFFFFF")
	   		.style("stroke-width", 0.5);
	  }

	function donoutMouseOut()
	{
		d3.select(this)
			.transition()
			.duration(200)
			.style("stroke", "black")
			.style("stroke-width", "2px");

		var tooltip = d3.select(".tooltip");

		tooltip.style("opacity", 0);
	}


}

