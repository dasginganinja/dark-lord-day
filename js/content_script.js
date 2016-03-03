// initialize the state of the script
init();

function dld_bg() {
	// Set the background
	var bgurl = getExtensionURL('images/bg_darklord.jpg');
	var bgval = "url('" + bgurl + "')";
	$(document).ready(function () {
		document.body.style.backgroundImage = bgval;
	});
}

// Actions to take for target performance
if (performance_id != undefined && performance_id == config.performance_id_default) {
	
	// Enhanced Page Style
	dld_bg();

	// Moody blues: 2975795
	// Jay-Z: 6503389

	// Live URL:    http://www.etix.com/ticket/p/6503389
	// Presale URL: http://event.etix.com/ticket/online/performanceSale.do?performance_id=7745932&method=restoreToken
	// Live URL: www.etix.com/ticket/online/performanceSale.do?method=restoreToken&performance_id=4894601
	
}

setTickets(undefined, 2);