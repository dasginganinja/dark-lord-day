var config = {
	"performance_id_default": 6503389//7745932
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

/* Getter/Setter Functions */

function getExtensionURL(path) {
	return chrome.extension.getURL(path);
}

function getPerformanceID() {
	return state.performance_id;
}

function getPerformanceIDFromURL() {
	//var expression = /(p\/|performance_id\=)([0-9]+)/g;
	var expression = /\d+/;
	var regex = new RegExp(expression);
	var matches = window.location.href.match(regex);
	if (matches) {
		return matches[0];
	}
	return undefined;
}

function getPerformanceState() {
	return state.performance_state;
}

function getDomain() {
	return window.location.hostname;
}
function getDomainPresale() {
	return 'event.etix.com';
}
function getDomainSale() {
	return 'www.etix.com';
}

/* Common Routines */

function dld_init() {
	// Initialize performance_id
	var paramid = getPerformanceIDFromURL();
	if (paramid) {
		state.performance_id = paramid;
	}

	// initialize method

	// initialize state
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