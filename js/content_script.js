// initialize the state of the script
dld_init();

function dld_bg() {
	// Set the background
	var bgurl = getExtensionUrl('images/bg_darklord.jpg');
	var bgval = "url('" + bgurl + "')";
	$(document).ready(function () {
		document.body.style.backgroundImage = bgval;
	});
}

function removeAllTix() {
	$('body').append('<a id="cleartix">Remove all tix</a>');
	$('#cleartix').click(function(e) {
		e.preventDefault();
		clearShoppingCart();
	});
}

// Actions to take for target performance
if (state.performance_id != undefined && state.performance_id == config.performance_id_default) {
	
	// Enhanced Page Style
	dld_bg();

	// Dark Lord Days: 7745932
	// Moody blues: 2975795
	// Jay-Z: 6503389

	// Live URL:    http://www.etix.com/ticket/p/6503389
	// Presale URL: http://event.etix.com/ticket/online/performanceSale.do?performance_id=7745932&method=restoreToken
	// Live URL: www.etix.com/ticket/online/performanceSale.do?method=restoreToken&performance_id=4894601
	
///	// Cart URL: https://www.etix.com/ticket/online/performanceSale.do?method=viewShoppingCart
///	// Jadakiss URL: https://www.etix.com/ticket/online/performanceSale.do?method=restoreToken&performance_id=6503389&method=restoreToken



	// Jay-Z RestoreToken URL: http://www.etix.com/ticket/online/performanceSale.do?method=restoreToken&performance_id=6503389


	if (state.buymode && state.checkout_step == 'sale') {
		var reserved = setTickets();
	}
}

removeAllTix();