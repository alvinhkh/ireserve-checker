/*
 * iReserve Checker
 * Copyright (c) 2014, AlvinHKH
 * http://alvinhkh.com
 * 
 * Date 2014-09-23 | 2014-10-09 | 2014-10-12
 *
 * This script can run in JavaScript Console on selected domain separately.
*/

// default refresh interval, 15 seconds
var default_milliseconds = 15*1000;
var refresh_milliseconds = default_milliseconds;

// normally available hour, 8 means 8AM in HKT, automatically increase refresh interval to 5 seconds
var default_hour = 8;
var faster_milliseconds = 5*1000;

// Region and devices
var region = "HK/zh_HK";
var device = ["iPhone"];
var url_stores = [];
var url_availability = [];
var url_reservation = [];
for (var i = 0; i < device.length; i++) {
	url_stores[i] = "https://reserve.cdn-apple.com/"+region+"/reserve/"+device[i]+"/stores.json";
	url_availability[i] = "https://reserve.cdn-apple.com/"+region+"/reserve/"+device[i]+"/availability.json";
	url_reservation[i] = "https://reserve.apple.com/"+region+"/reserve/"+device[i];
}

// Convert code given into meaningful text
var shop_code = [];
var shop_name = [];
var model_code = [];
var model_name = [];
shop_code = [
	"R409",
	"R485",
	"R428"
];
shop_name = [
	"Causeway Bay",
	"Festival Walk",
	"ifc mall"
];
var region_code = "ZP";
model_code = [
    "MG492"+region_code+"/A",
    "MG4J2"+region_code+"/A",
    "MG4E2"+region_code+"/A",
    "MG482"+region_code+"/A",
    "MG4H2"+region_code+"/A",
    "MG4C2"+region_code+"/A",
    "MG472"+region_code+"/A",
    "MG4F2"+region_code+"/A",
    "MG4A2"+region_code+"/A",

    "MGAA2"+region_code+"/A",
    "MGAK2"+region_code+"/A",
    "MGAF2"+region_code+"/A",
    "MGA92"+region_code+"/A",
    "MGAJ2"+region_code+"/A",
    "MGAE2"+region_code+"/A",
    "MGA82"+region_code+"/A",
    "MGAH2"+region_code+"/A",
    "MGAC2"+region_code+"/A",
];
model_name = [
    "A1586 iPhone 6 16GB Gold",
    "A1586 iPhone 6 64GB Gold",
    "A1586 iPhone 6 128GB Gold",
    "A1586 iPhone 6 16GB Space Gray",
    "A1586 iPhone 6 64GB Space Gray",
    "A1586 iPhone 6 128GB Space Gray",
    "A1586 iPhone 6 16GB Silver",
    "A1586 iPhone 6 64GB Silver",
    "A1586 iPhone 6 128GB Silver",

    "A1524 iPhone 6 Plus 16GB Gold",
    "A1524 iPhone 6 Plus 64GB Gold",
    "A1524 iPhone 6 Plus 128GB Gold",
    "A1524 iPhone 6 Plus 16GB Space Gray",
    "A1524 iPhone 6 Plus 64GB Space Gray",
    "A1524 iPhone 6 Plus 128GB Space Gray",
    "A1524 iPhone 6 Plus 16GB Silver",
    "A1524 iPhone 6 Plus 64GB Silver",
    "A1524 iPhone 6 Plus 128GB Silver",
];
var code = shop_code.concat(model_code);
var name = shop_name.concat(model_name);

var icon_url = "data:image/png;base64,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";

String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};

function notifyMe(title, message, icon_url, click_link) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        var notification = new Notification(title , { body: message , icon: icon_url });
		notification.onclick = function() {
			window.open(click_link, '_blank');
		};
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) {
            Notification.permission = permission;
        }
        if (permission === "granted") {
            var notification = new Notification(title , { body: message , icon: icon_url });
			notification.onclick = function() {
				window.open(click_link, '_blank');
			};
        }
    });
    }
}

var beep = (function () {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var ctx = new AudioContext();
    return function (duration, frequency, finishedCallback) {
        duration = +duration;
        if (typeof finishedCallback != "function") {
            finishedCallback = function () {};
        }
        var osc = ctx.createOscillator();
        osc.type = 'square'; //sine, square, sawtooth, triangle
		osc.frequency.value = frequency; // value in hertz
        osc.connect(ctx.destination);
        osc.noteOn(0);
        setTimeout(function () {
            osc.noteOff(0);
            finishedCallback();
        }, duration);
    };
})();

function getJson(url) {
	var r = "";
	try {
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET", url ,false);
		xmlhttp.send();
		if (xmlhttp.status == 200)
			r = xmlhttp.responseText;
	}
	catch(err) {
		console.log(err.message);
	}
	return r;
}

function swapJson(json) {
	if (json == "" || Object.keys(json).length < 1) return {};
	var swap = {};
	for (var key in json)
		for (var val in json[key])
			if (json[key].hasOwnProperty(val)){
				if (!swap.hasOwnProperty(val)) swap[val] = {};
				swap[val][key] = json[key][val];
			}
	return swap;
}

function setRunInterval(milliseconds) {
	console.log('set refresh interval', milliseconds, 'milliseconds');
	refresh_milliseconds = milliseconds;
	localStorage.setItem('refresh_milliseconds', refresh_milliseconds);
	clearInterval(actionInterval);
	actionInterval = setInterval(run, refresh_milliseconds);
}

function calcTime(date, offset) {
    // create Date object for current location
    d = new Date(date);
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));
    return nd;
}

var triggered = false;
var actionInterval;
if (actionInterval) stop(); //refresh the handler.
var getStoreInterval;
var timeCheck = 0;

// stop manually
function stop() {
    clearInterval(actionInterval);
    actionInterval = null;
    console.log('stop');
}

function run() {
    localStorage.setItem('device', device[0]);
    var json = "";
	var code = shop_code.concat(model_code);
	var name = shop_name.concat(model_name);
	
    json = JSON.parse(getJson(url_availability[0]));
	localStorage.setItem('availability', JSON.stringify(swapJson(json)));
    if (json != "" && Object.keys(json).length > 1){
        var updated = new Date(json.updated).toString();
		localStorage.setItem('updated', updated);
        console.log(updated);
        var available = false;
        for (var key in json) {
            var shop = json[key];
            for (var phone in shop) {
                if(shop.hasOwnProperty(phone)){
                    shop_text = key.replaceArray(code, name);
                    phone_text = phone.replaceArray(code, name);
                    if (json[key][phone] == true) {
                        available = true;
                        timeCheck = new Date().valueOf();
                        console.log(shop_text + ":", phone_text, "-", json[key][phone]);
                    }
                }
            }
        }

        if (available == true) {
			setRunInterval(faster_milliseconds);
			if (new Date().valueOf() > timeCheck) {
				if (triggered == false || new Date().valueOf() > timeCheck + (60000*60)) {
					triggered = true;
					notifyMe("iReserve started!", updated, icon_url, localStorage.getItem('url_reservation'));
					beep(2500, 800);
				}
			}
        } else {
			console.log('All gone.');
		}
    } else {
		localStorage.setItem('updated', new Date().toString());
    }
	if (available != true && calcTime(new Date(), +8).getHours() == default_hour) {
		setRunInterval(faster_milliseconds);
	} else if (available != true && refresh_milliseconds != default_milliseconds) {
		setRunInterval(default_milliseconds);
	}
    json = null;
}

var loadedStore = false;
function getStore() {
	// get stores list, for converting store code into store name
    var json = "";
    json = JSON.parse(getJson(url_stores[0]));
    if (json != "" && Object.keys(json).length > 1){
		loadedStore = true;
        shop_code = [];
		shop_name = [];
		url_reservation[0] = json.reservationURL;
        for (var i = 0; i < json.stores.length; i++) {
            shop_code.push(json.stores[i].storeNumber);
            shop_name.push(json.stores[i].storeName);
        }
		var code = shop_code.concat(model_code);
		var name = shop_name.concat(model_name);
		localStorage.setItem('code', JSON.stringify(code));
		localStorage.setItem('name', JSON.stringify(name));
		localStorage.setItem('url_reservation', url_reservation);
    }
}

function start() {
	setRunInterval(default_milliseconds);
    clearInterval(getStoreInterval);
    getStoreInterval = setInterval(function() {
		getStore();
		if (loadedStore == true && (shop_code.length > 0 || shop_name.length > 0)) {
			clearInterval(getStoreInterval);
		}
	}, refresh_milliseconds);
    // first-run
    run();
}

// Start
start();