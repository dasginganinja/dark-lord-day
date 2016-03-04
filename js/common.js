var config = {
	"performance_id_default": 7745932
};
var state = {
	"performance_id": undefined,
	"performance_state": undefined,
	"checkout_step": undefined,
	"buymode": true
};
var checkout_steps = [
	"presale",
	"ticketselection"
];
var methods = [
	"removeAllSeats",
	"restoreToken", // takes a performance_id

];

function getQueryParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getExtensionURL(path) {
	return chrome.extension.getURL(path);
}

function getPerformanceID() {
	return state.performance_id;
}

function getPerformanceState() {
	return state.performance_state;
}

function dld_init() {
	// Get ID from Query String
	var paramid = getQueryParameterByName('performance_id');
	if (paramid) {
		state.performance_id = paramid;
	}
}

function setTickets($form, num) {
	// Default values
	if ($form == undefined) {
		$form = jQuery('form[name="frmPickTicket"]');
	}
	if (num == undefined) {
		num = 2;
	}

	// Get the first ticket dropdown
	$element = $form.find('.price-level-row:first-child select');

	// Check to see we have an element to begin with
	if ($element == undefined || $element.length == 0) {
		return 0;
	}

	// Set the number of tickets
	$element.val(num);

	// Submit the form
	$form.find('button[type="submit"]').trigger('click');
	
	return 1;
}

function clearShoppingCart() {
	// method is remove all seats
	if ($('#removeAllSeatsFrm').length == 0) {
		$('body').append('<form id="removeAllSeatsFrm"></form>');
		$('#removeAllSeatsFrm')
			.attr('action', '/ticket/online/performanceSale.do?method=removeAllSeats')
			.attr('name', 'form2')
			.attr('method', 'post')
			.append('<input type="hidden" name="target" value="null">');
	}
	$('#removeAllSeatsFrm').submit();

	/**
	<form id="removeAllSeatsFrm" action="/ticket/online/performanceSale.do?method=removeAllSeats" name="form2" method="post">
	  <input type="hidden" name="target" value="null">
	</form>
	*/
}