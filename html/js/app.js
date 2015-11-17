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
var oViewer =null, oPOI ={}, oMQTT ={} ;

define (
	[
		'radialMenu',
		'smoothie',
		'mqtt',
		"goog!visualization,1,packages:[gauge]"
	],
	function (radialMenu, smoothie, mqtt, jsapi) {
		window.mqtt =mqtt ;
		return ({
			'initialize': function (viewerElt, urn, bWthToolbars, env) {
				bWthToolbars =bWthToolbars || false ;
				env =env || 'AutodeskProduction' ;
				var viewerConfig ={
					lightPreset: 8,
					viewerType: (bWthToolbars ? 'GuiViewer3D' : 'Viewer3D'),
					qualityLevel: [ true, true ],
					navigationTool: 'freeorbit',
					progressiveRendering: true
				} ;
				var viewerFactory =new Autodesk.ADN.Toolkit.Viewer.ViewerFactory (
					'http://' + window.location.host + '/auth',
					{ 'environment': env }
				) ;
				viewerFactory.onInitialized (function () {
					viewerFactory.getViewablePath (
						urn,
						function (pathCollection) {
							// the DOM container
							oViewer =viewerFactory.createViewer ($(viewerElt) [0], viewerConfig) ;
							// loads the first 3d or 2d path available
							if ( pathCollection.path3d.length > 0 )
								oViewer.load (pathCollection.path3d [0].path) ;
							else if ( pathCollection.path2d.length > 0 )
								oViewer.load (pathCollection.path2d[0].path) ;
							else
								return (alert ('ERROR: No 3D or 2D view found in this document!')) ;

							oViewer.loadExtension ('Autodesk.IoT', null) ;
							oViewer.loadExtension ('Autodesk.FirstPerson', null) ;

							oViewer.addEventListener ('progress', function (evt) {
								if ( evt.percent >= 100 ) {
									oViewer.removeEventListener ('progress', arguments.callee) ;
									oViewer.setActiveNavigationTool ('IoT') ;
								}
							}) ;
						},
						function (error) {
							console.info ("Load Error: " + error) ;
						}
					) ;
				}) ;
				return (viewerFactory) ;
			},

			'test': function () {

			}

		}) ;
	}

) ;
