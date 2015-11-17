/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015 Autodesk, Inc. All rights reserved
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

define ([ 'domReady!', 'threejs', 'viewer3d', 'viewer', 'IoTTool', 'app' ],
	function (doc, t, v3d, v, iot, app) {

		// If not using shim, you can do this instead.

		//require ([ 'viewer3d' ],
		//	function (viewer3d) { // will be undefined
		//		Autodesk =window.Autodesk ;
		//		require ([ 'IoTTool', 'viewer' ],
		//			function (iot, viewer) {
		//				app.initialize ($('#viewer'), 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTAxNS9QaWVyOS5kd2Z4', true) ;
		//			}
		//		) ;
		//	}
		//) ;

		// Initialize our viewer instance
		app.initialize (
			$('#viewer'),
			'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTAxNS9QaWVyOS5kd2Z4',
			true // toolbars
		) ;

		// Get our POI definition from the server
	    $.get ('/data/poi.json', function (data, status) {
			oPOI =data ;
	    }).fail (function (data) {
	        console.log (data) ;
			oPOI ={} ;
	    }) ;

		// Get our MQTT server instructions from the server
		$.get ('/data/mqtt.json', function (data, status) {
			oMQTT =data ;
		}).fail (function (data) {
			console.log (data) ;
			oMQTT ={} ;
		}) ;

	}
) ;
