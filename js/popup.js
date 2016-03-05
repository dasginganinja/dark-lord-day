// Links don't load unless you specify their click action.
// Create a new tab.
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})

jQuery(document).ready(function() {
	// var eventurl = document.getElementById('eventurl');
	var presaleurl = getPresaleTicketUrl(config.performance_id_default); 
	// eventurl.href = presaleurl;
	// http://stackoverflow.com/questions/17174093/how-do-i-toggle-on-off-content-scripts-in-a-google-extension

	$('#eventurl').attr('href', presaleurl);
});