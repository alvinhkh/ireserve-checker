/*
 * iReserve Checker
 * Copyright (c) 2014, AlvinHKH
 * http://alvinhkh.com
 * 
 * Date 2014-10-12
*/

String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};

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

    return nd.toLocaleString();
}

function createTable(obj) {
	var find = JSON.parse(localStorage.getItem('code'));
	var replace = JSON.parse(localStorage.getItem('name'));

	var table = document.createElement("table");

	var thead = document.createElement('thead');
	var firstrow = document.createElement('tr');
	firstrow.appendChild(document.createElement('td'));
	var colname = [''];
	for (var key in obj) {
		if (typeof obj[key] == 'object') {
			for (var val in obj[key]) {
				var col = document.createElement('td');
				col.id = val;
				col.innerText = val.replaceArray(find, replace);
				colname.push(val);
				firstrow.appendChild(col);
			}
			break;
		}
	}
	thead.appendChild(firstrow);
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	for (var key in obj) {
		var row = document.createElement('tr');
		if (typeof obj[key] == 'object') {
			var firstcol = document.createElement('td');
			firstcol.id = key;
			firstcol.innerText = key.replaceArray(find, replace);
			row.appendChild(firstcol);
			var col = [];
			for (var i = 1; i <= Object.keys(obj[key]).length; i++)
				col[i] = document.createElement('td');
			var row_bool = false;
			for (var val in obj[key]) {
				var index = colname.indexOf(val);
				var val = obj[key][val];
				if (val === true) {
					row_bool = true;
					col[index].className = 'true';
					col[index].innerText = '✓';
				} else if (val === false) {
					col[index].className = 'false';
					col[index].innerText = '✗';
				} else {
					col[index].innerText = val;
				}
			}
			for (var i = 1; i <= Object.keys(obj[key]).length; i++)
				row.appendChild(col[i]);
			row.className = (row_bool == true) ? 'true' : false;
			tbody.appendChild(row);
		}
	}
	table.appendChild(tbody);
	
	return table;
}

var actionTimeout;
var refresh_milliseconds = 30*1000;

function update() {
	console.log('update', ':', new Date().toString());
	refresh_milliseconds = Number(localStorage.getItem('refresh_milliseconds'));
	
	var d = document.getElementById('container');
	d.innerHTML = '';
	
	var updated = localStorage.getItem('updated');
	var p = document.createElement("p");
	p.innerText = updated;
	d.appendChild(p);
	var p = document.createElement("p");
	p.innerText = "HKT " + calcTime(updated, +8);
	d.appendChild(p);

	var table_availability = createTable(JSON.parse(localStorage.getItem('availability')));
	d.appendChild(table_availability);
	
	clearTimeout(actionTimeout);
	actionTimeout = setTimeout(update, refresh_milliseconds);
}

function run() {
	var container = document.createElement('div');
	container.id = 'container';
	document.body.appendChild(container);
	
	update();
}

window.addEventListener ('DOMContentLoaded', run, false);