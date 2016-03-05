jQuery(document).ready(function() {
	// var eventurl = document.getElementById('eventurl');
	var presaleurl = getPresaleTicketUrl(config.performance_id_default); 
	// eventurl.href = presaleurl;
	// http://stackoverflow.com/questions/17174093/how-do-i-toggle-on-off-content-scripts-in-a-google-extension

	$('#eventurl').attr('href', presaleurl);
});