/*
 * iReserve Checker
 * Copyright (c) 2014, AlvinHKH
 * http://alvinhkh.com
 * 
 * Date 2014-10-12
*/

function createTab() {
	chrome.tabs.create({
		url: "popup.html",
		active: true
	});
}
chrome.browserAction.onClicked.addListener(createTab);

window.addEventListener ('DOMContentLoaded', function(){
	try {
		chrome.browserAction.setIcon({
			path: icon_url
		});
	} catch (e) {}
}, false);