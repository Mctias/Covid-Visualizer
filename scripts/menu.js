
/* Open when someone clicks on the span element */
function openNav() {
  document.getElementById("myNav").style.width = "25%";
  document.getElementById("left-menu-btn").style.visibility = "hidden";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  document.getElementById("left-menu-btn").style.visibility = "visible";
}

function populateMenu()
{
	document.getElementById("total-cases").innerHTML = numberWithCommas(totalCases);
	document.getElementById("active-cases").innerHTML = activeCases;
	document.getElementById("total-deaths").innerHTML = numberWithCommas(totalDeaths);
	document.getElementById("total-recovered").innerHTML = numberWithCommas(totalRecovered);
}

function numberWithCommas(x) 
{
	if(x == undefined)
		return undefined;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}