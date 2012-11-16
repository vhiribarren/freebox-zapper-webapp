/*
Freebox Zapper - Remote control for the Freebox
Copyright (C) 2012 Vincent Hiribarren

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function($, Modernizr) {
"use strict";
	
// Constants
var COMMAND_URL = "http://hd1.freebox.fr/pub/remote_control";

// Global variables
var remoteControlCode = null;


function sendCommand(remoteControlId, command) {
	var targetUrl = COMMAND_URL + "?";
	targetUrl = targetUrl + "code=" + remoteControlId + "&";
	targetUrl = targetUrl + "key=" + command;
	console.log("sendCommand: "+command);
	$.ajax({
		url: targetUrl,
		type: 'GET',
		dataType: 'text',
		statusCode: {
			403: function() {
				$( "#badRemoteControlCode" ).popup("open");
			},
			500: function() {
				$( "#badCommandCode" ).popup("open");
			}
		},
		error: function() {
			console.info("Error in sendCommand.");
		}
	});
}

function checkCapabilities() {
	if (Modernizr.localstorage)
		return;
	window.localStorage = (function() {
		var data = {firstLaunch: false, remoteControls: []};
		var storage = {};
		storage.getItem = function(item) {return data[item];};
		storage.setItem = function(item, value) {data[item] = value;};
		return storage;
	})();
	$.mobile.changePage('#notEnoughCapabilities');
}

function checkFirstLaunch() {
	var isFirstLaunch = localStorage.getItem("firstLaunch");
	if ( isFirstLaunch === null) {
		localStorage.setItem("firstLaunch", false);
		$.mobile.changePage('#pageConfigure');
		$.mobile.changePage('#firstLaunchDialog');	
	}
}

function loadRemoteControlCode() {
	var code = localStorage.getItem("remoteControlCode");
	if (code === null)
		return;
	remoteControlCode = code;
	$("#inputRemoteControlCode").val(remoteControlCode);	
}

$(function() {
	console.info("Starting Webapp");
	$(".btn").click(function() {
		if ( remoteControlCode !== null ) {
			var command = $(this).attr("data-btn");
			sendCommand(remoteControlCode, command);		
		}
		else {
			$( "#noRemoteControlCode" ).popup("open");
		}
	});
	$("#inputRemoteControlCode").change(function() {
		var code = $("#inputRemoteControlCode").val();
		if (code === null || code === "") {
			remoteControlCode = null;
		}
		else {
			remoteControlCode = code;
		}
		localStorage.setItem("remoteControlCode", code);
	});
	$.mobile.changePage('#pageRemoteControl');
	checkCapabilities();
	checkFirstLaunch();
	loadRemoteControlCode();
});


})(jQuery, Modernizr);