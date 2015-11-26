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
		//'use strict';

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
		var model =GetURLParameter ('model') ;
		var config ='poi' + (model !== undefined ? '-' + model : '') ;
		var models={
			'poi': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTAxNS9QaWVyOS5kd2Z4', // Full model
			'poi-original': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTAxNS9QaWVyOS5kd2Z4', // Full model, with original definition
			'poi-reduced': 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTAxNS9QaWVyOV9Xb3Jrc2hvcC5ydnQ=' // Reduced model
		} ;
		app.initialize ($('#viewer'), models [config], true) ; // true = with toolbars

		// Get our POI definition from the server
	    $.get ('/data/' + config + '.json', function (data, status) {
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

		function GetURLParameter (sParam) {
			var sPageURL =window.location.search.substring (1) ;
			var sURLVariables =sPageURL.split ('&') ;
			for ( var i =0 ; i < sURLVariables.length ; i++ ) {
				var sParameterName =sURLVariables [i].split ('=') ;
				if ( sParameterName [0] == sParam )
					return (sParameterName [1]) ;
			}
		}

	}
) ;
