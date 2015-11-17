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
var viewerVersion ='' ; // ?v=1.2.29

requirejs.config ({
	'baseUrl': '/js',
	'shim': {
		// Use shim to mix together all THREE.js subcomponents
		'threejs': { 'exports': 'THREE' },
		'css3d': {
			'deps': [ "threejs" ],
			'exports': 'THREE'
		},
		'viewer3d': {
			'deps': [ "jquery", "threejs" ],
			'exports': 'Autodesk',
			'init': function () {
				return ({
					'Autodesk': Autodesk,
					'AutodeskNamespace': AutodeskNamespace
				}) ;
			}
		},
		'viewer': {
			deps: [ "viewer3d" ],
			'exports': 'Autodesk'
		},
		'IoTTool': {
			'deps': [ "viewer3d" ],
			'exports': 'Autodesk',
			'init': function () {
				return ({
					'Autodesk': Autodesk
				}) ;
			}
		}
	},
	'paths': {
		'app': 'app',
		'app-init': 'app-init',
		'themes': 'themes',
		'IoTTool': 'IoTTool',
		'radialMenu': 'radial-menu',

		'jquery': '/bower_components/jquery/dist/jquery.min',
		'threejs': 'https://developer.api.autodesk.com/viewingservice/v1/viewers/three.min',
		'viewer3d': 'https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D',
		'viewer': '/bower_components/view-and-data-toolkit/dist/js/viewer',
		'domReady': '/bower_components/domReady/domReady',
		//'async': '/bower_components/async/dist/async.min',

		// We need this version of async because of the jsapi
		'async': '/bower_components/requirejs-plugins/src/async',
		'goog': '/bower_components/requirejs-plugins/src/goog',
		'propertyParser': '/bower_components/requirejs-plugins/src/propertyParser',

		'mqtt': '/libs/mqtt.min',
		'css3d': '/libs/CSS3dRenderer',
		'smoothie': '/libs/smoothie' // '/bower_components/smoothie/smoothie'
	}

	, waitSeconds: 15
	//, 'enforceDefine': false
}) ;

requirejs ([ 'jquery', 'themes', 'radialMenu', 'css3d', 'app-init' ],
	function ($, themes, radialMenu, App) {
		themes.loadCss ('https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700') ;
		themes.loadCss ('https://developer.api.autodesk.com/viewingservice/v1/viewers/style.css' + viewerVersion) ;
		themes.loadCss ('/css/app.css') ;
		themes.loadCss ('/css/IoTTools.css') ;
		themes.loadCss ('/css/radial-menu.css') ;

		window.radialMenu =radialMenu ; // IotTools.js shim module needs to access this module
	}) ;

define ([], function () {}) ;
