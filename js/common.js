var config = {
	"performance_id_default": 6503389,//7745932,
	"sale_new_tabs": 5
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
	"viewShoppingCart"
];

var tab_interval = []; // Used to store the interval

/* Getter/Setter Functions */

function getExtensionUrl(path) {
	return chrome.extension.getURL(path);
}

function getPerformanceId() {
	return state.performance_id;
}

function getPerformanceIDFromUrl() {
	//var expression = /(p\/|performance_id\=)([0-9]+)/g;
	var expression = /\d+/;
	var regex = new RegExp(expression);
	var matches = window.location.href.match(regex);
	if (matches) {
		return matches[0];
	}
	return undefined;
}
function getPerformanceIDFromMeta() {
	// http://www.raymondcamden.com/2012/11/26/Reading-Microdata-Elements-in-Chrome/
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
	var paramid = getPerformanceIDFromUrl();
//	var paramid = getPerformanceIDFromMeta();
	if (paramid) {
		state.performance_id = paramid;
	}

	// initialize step
	var curDomain = getDomain();
	if (curDomain == getDomainPresale()) {
		state.checkout_step = 'presale';
	} else if (curDomain == getDomainSale()) {
		state.checkout_step = 'sale';
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

function openNewTab(url) {
	chrome.tabs.create({ "url": url });
}

function getSaleTicketUrl(performance_id) {
	return "http://www.etix.com/ticket/online/"
	  + "performanceSale.do?method=restoreToken&performance_id=" 
	  + performance_id;
}

function getPresaleTicketUrl(performance_id) {
	return "http://event.etix.com/ticket/online/performance_id=7745932&method=restoreToken"
	  + "performanceSale.do?method=restoreToken&performance_id=" 
	  + performance_id;
}

function setupRequestListener() {
	chrome.webRequest.onBeforeRedirect.addListener(
		function(details) {

			// Error callback starts here
			
			// details.url

			// details.tabId

			// details.timeStamp

			// Loop through and open a few tabs when we detect the event going live
			for (var i=0;i<config.sale_new_tabs;++i) {
				openNewTab();
			}
			return {};
		},
		{
		    urls: [
		        "*://event.etix.com/ticket/online/*"
		    ],
		    types: ["main_frame"]
		},
		["blocking"]
	);
}

function setupErrorListener() {

	chrome.webRequest.onErrorOccurred.addListener(
		function(details) {

			// Error callback starts here
			
			// details.url

			// details.tabId

			// details.timeStamp

			chrome.tabs.update(
				details.tabId, 
				{
					url: getSaleTicketUrl()
				}
			);

			return {};
		},
		
{		    urls: [
		        "*://www.etix.com/ticket/p/*",
		        "*://event.etix.com/ticket/p/*",
		        "*://www.etix.com/ticket/online/*",
		        "*://event.etix.com/ticket/online/*"
		    ],
		    types: ["main_frame"]
		},
		["blocking"]
	);
}

function setupCartListener() {

	// the cart listener will close out existing etix tabs when it detects the cart
	//viewShoppingCart
	// onResponseStarted

	chrome.webRequest.onResponseStarted.addListener(
		function(details) {

			// Error callback starts here
			
			// details.url

			// details.tabId

			// details.timeStamp

			// Close out the other active etix tabs
			chrome.tabs.query(
				{
					"url": [
						"*://event.etix.com/ticket/online/*", // all presale
						"*://www.etix.com/ticket/p/*", // all event pages on the main site
						"*://www.etix.com/ticket/online/performanceSale.do?*method=restoreToken*" // all event pages on the main site
					]
				},
				function (tabArr) {
					for (var i = 0; tabArr[i]; i++) {
						chrome.tabs.remove(tabArr[i].tabId);
					}
				}
			);
			return {};
		},
		
{		    urls: [
		        "*://www.etix.com/ticket/online/performanceSale.do?*method=viewShoppingCart*"
		    ],
		    types: ["main_frame"]
		},
		["blocking"]
	);
}

function getCalculatedIntervalMS() {
	return 300;
}

function setupTimer() {
	var baseMinimum = 10 * 1000; //10s * 1000 = 10000ms
	var calculatedInterval = getCalculatedInterval();



	var interval = Math.min(baseMinimum, calculatedInterval);
	setTimeout(timerCallback, interval);
}

function timerCallback() {
	window.location = getSaleTicketUrl();
}



// General idea is to loop and refresh tabs
// DONE: When the tabs load and there is an error it will refresh the tab
// DONE: When the tab detects that it is redirecting we should probably spawn 
//    a few tabs or new windows with the sale page so that the
//    automated ticket reservation can take over.
// There should be a timer (window.setTimeout) that decreases its 
//    checking interval as the time to the event gets closer.
// If the time to the event for that tab is less than the interval, cut the interval in half.
//    If it is still then too large halve it again.
//    After five times just set the interval time to the difference between the event