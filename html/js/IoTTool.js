//
// Copyright (c) Cyrille Fauvel, Inc. All rights reserved
//
// Node.js server workflow
// by Cyrille Fauvel
// September 2015
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// Cyrille Fauvel PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// Cyrille Fauvel SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  Cyrille Fauvel
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//

// This variable is always 'false'. Turn it true only to configure your model
// Select a object in the scene and see the javascript console for configuration parameters
var configurationMode =false ;

AutodeskNamespace ('Autodesk.Viewing.Extensions.IoT') ;

// IoT Extension
Autodesk.Viewing.Extensions.IoTExtension =function (viewer, options) {
	Autodesk.Viewing.Extension.call (this, viewer, options) ;
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype =Object.create (Autodesk.Viewing.Extension.prototype) ;
Autodesk.Viewing.Extensions.IoTExtension.prototype.constructor =Autodesk.Viewing.Extensions.IoTExtension ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.load =function () {
	var self =this ;
	var _viewer =this.viewer ;
    var _toolbar =this.viewer.getToolbar (true) ;

	// Register tool
	this.tool =new Autodesk.Viewing.Extensions.IoTTool (_viewer, this) ;
	_viewer.toolController.registerTool (this.tool) ;

	// Add the ui to the viewer.
	if ( _toolbar ) {
		var navTools =_toolbar.getControl (Autodesk.Viewing.TOOLBAR.NAVTOOLSID) ;
		if ( navTools && navTools.getNumberOfControls () > 0 )
			onToolbarCreated () ;
		else
			_viewer.addEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
	} else {
		_viewer.addEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated) ;
	}

	function onToolbarCreated () {
		_viewer.removeEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated) ;
		self.createUI (_toolbar) ;
	}

    // Detect Tool change status
    /*this.onToolChanged =function (e) {
       if (e.toolName.indexOf ('Autodesk.IoT') === -1 )
           return ;
        var state =e.active ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE ;
        self.IoTToolButton.setState (state) ;
    } ;
    _viewer.addEventListener (Autodesk.Viewing.TOOL_CHANGE_EVENT, this.onToolChanged) ;*/

	return (true) ;
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.createUI =function (toolbar) {
	var self =this ;
	var viewer =this.viewer ;
	try {
        this.ioTToolGroup =new Autodesk.Viewing.UI.ControlGroup ('IoTGroupTools') ;
        this.ioTToolButton =new Autodesk.Viewing.UI.Button ('IoTTool') ;
        this.ioTToolButton.setIcon ("adsk-icon-IoT") ;
        this.ioTToolButton.setToolTip ("IoT Tool") ;
        this.ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.INACTIVE) ;
        var ioTToolButton =this.ioTToolButton ;
        this.ioTToolButton.onClick =function (e) {
            var state =ioTToolButton.getState () ;
            if ( state === Autodesk.Viewing.UI.Button.State.INACTIVE ) {
                ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.ACTIVE) ;
                viewer.setActiveNavigationTool ('IoT') ;
            } else if ( state === Autodesk.Viewing.UI.Button.State.ACTIVE ) {
                ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.INACTIVE) ;
                viewer.setActiveNavigationTool () ;
            }
        } ;
        this.ioTToolGroup.addControl (this.ioTToolButton, { index: 0 }) ;
        toolbar.addControl (this.ioTToolGroup) ;
	} catch ( e ) {
 	}
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.unload =function () {
    var self =this ;

    // Remove onToolChanged event
	//this._viewer.removeEventListener (Autodesk.Viewing.TOLL_CHANGE_EVENT, this.onToolChanged) ;

    // Remove hotkey
    Autodesk.Viewing.theHotkeyManager.popHotkeys (this.HOTKEYS_ID) ;

	// Remove the UI
	var toolbar =this.viewer.getToolbar (false) ;
	if ( toolbar )
        this.viewer.getControl (Autodesk.Viewing.TOOLBAR.NAVTOOLSID).removeControl (this.ioTToolButton.getId ()) ;
    this.ioTToolGroup =null ;
	this.ioTToolButton =null ;

	// Deregister tool
    this.viewer.toolController.deregisterTool (this.tool) ;
	this.tool =null ;

	return (true) ;
} ;

Autodesk.Viewing.theExtensionManager.registerExtension ('Autodesk.IoT', Autodesk.Viewing.Extensions.IoTExtension) ;


// IoT Tool
Autodesk.Viewing.Extensions.IoTTool =function (viewer, IoTExtension) {
	var _self =this ;

	var _viewer =viewer ; this.viewer =function () { return (_viewer) ; } ;
	var _navapi =viewer.navigation ; this.navapi =function () { return (_navapi) ; } ;
	var _container =$(viewer.container) ; this.container =function () { return (_container) ; } ;
	var _camera =_navapi.getCamera () ; this.camera =function () { return (_camera) ; } ;
	var _names =[ 'IoT' ] ;

	var _isActive =false ;
    var _clock =new THREE.Clock (true) ;
    var _wasPerspective =_camera.isPerspective ;
    var _previousFov =_camera.fov ;
    var _scale =_camera.scale.clone () ; this.scale =function () { return (_scale) ; } ;

    var _sensorPanelRenderer =new THREE.CSS3DRenderer () ; // CSS3D Renderer
	//this.poiNavigationMenu
	//this.webpage
    var _sensorPanels ={} ; this.sensorPanels =function () { return (_sensorPanels) ; } ;
	var _mqttClient =null ;

	this.update =function (timeStamp) {
        //requestAnimationFrame (this.update) ;
        //_sensorPanelRenderer.render (this.sensorPanels.scene (), this.camera ()) ;
        Object.keys (_sensorPanels).map (function (sensorid) {
            _sensorPanelRenderer.render (_sensorPanels [sensorid].scene (), _camera) ;
        }) ;

		if ( this.webpage )
			_sensorPanelRenderer.render (this.webpage.scene, _camera) ;
        //controls.update () ;
	} ;

	// Tool Interface
	this.isActive =function () {
		return (_isActive) ;
	} ;

	this.getNames =function () {
		return (_names) ;
	} ;

	this.getName =function () {
		return (_names [0]) ;
	} ;

	this.activate =function (name) {
		if ( _isActive )
			return ;
        _isActive =true ;
		_viewer.loadedExtensions ['Autodesk.IoT'].ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.ACTIVE) ;

		// This is to prevent Shift to disable our tool
		Autodesk.Viewing.theHotkeyManager.popHotkeys ('Autodesk.Pan') ;

		// Connect to our sensor broker
		oMQTT.mqtt.protocol =window.location.protocol == 'https:' ? 'wss' : 'ws' ;
		_mqttClient =mqtt.connect (oMQTT.mqtt) ;
		_mqttClient.on ('connect', function () {
			_mqttClient.subscribe (oMQTT.topic + '/#') ; // Subscribe to all sub-topics
		}) ;
		_mqttClient.on ('message', _self.onMqttMessage) ;

		// CSS3D Renderer
        _sensorPanelRenderer.setSize (_container.outerWidth (), _container.outerHeight ()) ;
        $(_sensorPanelRenderer.domElement)
            .css ('position', 'absolute')
            .css ('top', '0px')
            .css ('z-index', 1)
            .css ('pointer-events', 'none')
            .appendTo (_container) ;

		_clock.start () ;

		_wasPerspective =_camera.isPerspective ;
		_navapi.toPerspective () ;

		_previousFov =_camera.fov ;
		_navapi.setVerticalFov (75, true) ;

		// Already called from the loading library, and actually this is no good calling it from activate()
		//_viewer.fitToView (true) ;
		//setTimeout (function () { _viewer.autocam.setHomeViewFrom (_camera) ; }, 1000) ;

		// Calculate a movement scale factor based on the model bounds (ignore selection).
		var boundsSize =_viewer.utilities.getBoundingBox (true).size () ;
		//_modelScaleFactor =Math.max (Math.min (Math.min (boundsSize.x, boundsSize.y), boundsSize.z) / 100.0, 1.0) ;

		// HACK: Attempt to place focus in canvas so we get key events.
		_viewer.canvas.focus () ;

        this.createPOINavigationMenu () ;
        this.createSensorMarkers () ;
		this.createWebpage () ;
		this.activatePOINavigation () ;

		this.onItemSelectedProxy =$.proxy (this.onItemSelected, this) ;
        _viewer.addEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onItemSelectedProxy) ;
		this.onCameraChangedProxy =$.proxy (this.onCameraChanged, this)
        _viewer.addEventListener (Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangedProxy) ;
		this.onViewportSizeChangedProxy = $.proxy (this.onViewportSizeChanged, this);
		_viewer.addEventListener (Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewportSizeChangedProxy) ;
    } ;

	this.deactivate =function (name) {
		if ( !_isActive )
			return ;
		_isActive =false ;
		_viewer.loadedExtensions ['Autodesk.IoT'].ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.INACTIVE) ;

		_clock.stop () ;

		// We should restore the default behavior, but the API does not give us access to the previous definition
		//Autodesk.Viewing.theHotkeyManager.pushHotkeys ("Autodesk.Pan", hotkeys, { tryUntilSuccess: true }) ;
		// instead try to register them all again
		_viewer.registerUniversalHotkeys () ;

        _viewer.removeEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onItemSelectedProxy) ;
        _viewer.removeEventListener (Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangedProxy) ;
		_viewer.removeEventListener (Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewportSizeChangedProxy) ;

		this.hideUIElements () ;

		_mqttClient.unsubscribe (oMQTT.topic + '/#', function () {
			_mqttClient.end (true, function () {
				_mqttClient =null ;
			}) ;
		}) ;

	} ;

	this.onMqttMessage =function (topic, message) {
		//console.log (topic) ;
		// First determine the sensor's uuid
		var topics =topic.split ('/') ;
		var sensorid =topics [1] ; // or in the message itself ( 'id' )
		//console.log (sensorid) ;
		var sensors =_self.sensorPanels () ;
		if ( sensors [sensorid] === undefined )
			return ;
		var sensorPanel =sensors [sensorid] ;
		var msg =JSON.parse (message) ;
		//console.log (JSON.stringify (msg)) ;
		$.each (msg, function (key, value) {
			var mapKey =key ;

			if ( key == 'id' || key == 'ts' )
				return ;
			else if ( key == 'x' || key == 'y' || key == 'z' )
				mapKey =topics [2] + '.' + key ;
			else if ( key == 'amb' || key == 'obj' )
				value =(value * 9 / 5 + 32) ; // Celsius °C to Fahrenheit °F

			if ( typeof oMQTT.mapping [mapKey] === 'string' )
				sensors [sensorid].updateFeeds (oMQTT.mapping [mapKey], value.toFixed (2)) ;
			else
				oMQTT.mapping [mapKey].map (function (kobj) { sensors [sensorid].updateFeeds (kobj, value.toFixed (2)) ; } ) ;
		}) ;
	} ;

	this.getCursor =function () {
        return ("url(data:image/png;base64,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), auto") ;
	} ;

    this.navigate =function (position, target) {
        _navapi.setTarget (new THREE.Vector3 ().copy (target)) ;
        _navapi.setPivotPoint (new THREE.Vector3 ().copy (target)) ;
        _navapi.setPosition (new THREE.Vector3 ().copy (position)) ;
        _camera.zoom =1.0 ;
        _navapi.orientCameraUp () ;
		/*var destination ={
			position: new THREE.Vector3 ().copy (position),
			up: _camera.up.clone (),//_navapi.getAlignedUpVector ().clone (),
			center: new THREE.Vector3 ().copy (target),
			pivot: new THREE.Vector3 ().copy (target),
			fov: _camera.fov,
			worldUp: _navapi.getWorldUpVector ().clone (),
			isOrtho: false
		} ;
		_viewer.autocam.goToView (destination) ;*/
        _viewer.select ([]) ;
    } ;

	this.createWebpage =function () {
		var self =this ;
		if ( this.webpage !== undefined )
			return ;
		var webpage =$(document.createElement ('iframe'))
			.attr ('id', 'webpage')
			.attr ('src', '')
			.attr ('width', '400px').attr ('height', '400px')
			.css ('display', 'none')
			.css ('pointer-events', 'auto') ; // not none
		var div =new THREE.CSS3DObject (webpage [0]) ;
		div.position.set (0, 0, 0) ;
		div.rotation.set (0, 0, 0) ; // Math.PI / 2 ;
		div.scale.set (.1, .1, .1) ;

		var scene =new THREE.Scene () ;
		scene.add (div) ;

		this.webpage ={ 'scene': scene, 'webpage': webpage, 'css3d': div } ;
	} ;

	this.webpageNavigate =function (sensor, url) {
		this.webpage.webpage
			//.css ('pointer-events', 'auto')
			.attr ('src', url) ;

		this.webpage.css3d.position.set (sensor.position.x, sensor.position.y, sensor.position.z) ;
		this.webpage.css3d.rotation.set (sensor.rotation.x, sensor.rotation.y, sensor.rotation.z) ; // Math.PI / 2 ;
		this.webpage.css3d.scale.set (sensor.scale, sensor.scale, sensor.scale) ;
		this.navigate (sensor.viewfrom, sensor.position) ;

		this.activateWebpageNavigation () ;
	} ;

	this.createPOINavigationMenu =function () {
        var self =this ;
		if ( this.poiNavigationMenu !== undefined )
			return ;
        this.poiNavigationMenu =this.createRadialMenu (
            oPOI,
            '/images/menu.png',
            function (evt) {
                evt.preventDefault () ;
				window.radialMenu.toggleOptions ($(this).parent ().parent ().parent ()) ;
                var poiid =$(this).attr ('for').split ('-') [0] ;
                var poiKey =Object.keys (oPOI).filter (function (rkey) { return (rkey.replace (/\W/g, '') === poiid) ; }) [0] ;
                var poi =oPOI [poiKey] ;
                self.navigate (poi.position, poi.target) ;
            }
        ) ;
    } ;

    this.createRadialMenu =function (menudef, img, clickCB, bConvert) {
        var self =this ;
        bConvert =(bConvert == undefined ? true : bConvert) ;
        var menu =$(document.createElement ('div'))
            .attr ('class', 'menu-selector-inviewer')
            .attr ('id', guid ())
            .css ('width', _container.outerWidth ()).css ('height', _container.outerHeight ())
            .css ('position', 'absolute').css ('top', '0px').css ('left', '0px')
            .css ('background-color', 'transparent')
            .css ('pointer-events', 'none')
            .appendTo (_container) ;
        var s =$(document.createElement ('div')).attr ('class', 'menu-selector').appendTo (menu) ;
        var ul =$(document.createElement ('ul')).appendTo (s) ;
        if ( menudef.constructor === Array )
            $.each (menudef, function (key, value) {
                var id =value.replace (/\W/g, '') ;
                var li =$(document.createElement ('li'))
					.appendTo (ul) ;
                var input =$(document.createElement ('input'))
					.attr ('id', id + '-input')
					.attr ('type', 'checkbox')
					.appendTo (li) ;
                $(document.createElement ('label'))
					.attr ('for', id + '-input')
					.text (value)
					.appendTo (li)
					.click (clickCB) ;
            }) ;
        else
            $.each (menudef, function (key, value) {
                var id =bConvert ? key.replace (/\W/g, '') : key ;
                var li =$(document.createElement ('li'))
					.appendTo (ul) ;
                var input =$(document.createElement ('input'))
					.attr ('id', id + '-input')
					.attr ('type', 'checkbox')
					.appendTo (li) ;
                var elt =$(document.createElement ('label'))
					.attr ('for', id + '-input')
					.attr ('title', typeof value === 'string' ? value : value.name)
					.text (value.hasOwnProperty ('icon') ? '' : value.name)
					.appendTo (li)
					.click (clickCB) ;
				if ( value.hasOwnProperty ('icon') )
					elt.css ('background', 'url(' + value.icon + ') no-repeat center center')
						.addClass (value.iconClass) ;

            }) ;
        var b =$(document.createElement ('button'))
			.appendTo (s)
            .click (function (e) {
                window.radialMenu.toggleOptions ($(this).parent ()) ;
            }) ;
        $(document.createElement ('img'))
			.attr ('src', img)
			.appendTo (b) ;
        return (menu) ;
    } ;

    this.onItemSelected =function (evt) {
        var self =this ;

		this.activatePOINavigation () ;
		if ( evt.dbIdArray == undefined || evt.dbIdArray.length == 0 )
	        return ;
		//console.log (evt.dbIdArray [0]) ;

		$.each (oPOI, function (key, value) {
			if (   (typeof value.sensors.dbid === 'number' && value.sensors.dbid === evt.dbIdArray [0])
				|| (typeof value.sensors.dbid === 'object' && $.inArray (evt.dbIdArray [0], value.sensors.dbid) != -1)
			) {
				if ( configurationMode !== true )
					//window.open (value.url) ;
					self.webpageNavigate (value.sensors, value.url) ;
			}
		}) ;

		// See comments at the top of the file
		if ( configurationMode !== true )
			return ;

		// _viewer.model.getBoundingBox () // full model bounding box
		// We need the Object bounding box, not the model
		var bounds =new THREE.Box3 () ;
		var box =new THREE.Box3 () ;
		var instanceTree =_viewer.model.getData ().instanceTree ;
		var fragList =_viewer.model.getFragmentList () ;
		instanceTree.enumNodeFragments (
			evt.dbIdArray [0],
			function (fragId) {
				fragList.getWorldBounds (fragId, box) ;
				bounds.union (box) ;
			},
			true
		) ;
		//console.log (bounds) ;
		var center =bounds.center () ;
		var size =bounds.size () ;
		var up =_navapi.getWorldUpVector () ;
		var faceCenters =[] ; // This is sensors possible places
		if ( up.x == 0 ) {
			var pt =center.clone () ; pt.x += size.x / 2 ; faceCenters.push (pt) ;
			pt =center.clone () ; pt.x -= size.x / 2 ; faceCenters.push (pt) ;
		}
		if ( up.y == 0 ) {
			var pt =center.clone () ; pt.y += size.y / 2 ; faceCenters.push (pt) ;
			pt =center.clone () ; pt.y -= size.y / 2 ; faceCenters.push (pt) ;
		}
		if ( up.z == 0 ) {
			var pt =center.clone () ; pt.z += size.z / 2 ; faceCenters.push (pt) ;
			pt =center.clone () ; pt.z -= size.z / 2 ; faceCenters.push (pt) ;
		}
		// Now choose the closest to the camera viewpoint
		var d0 =-1, i0 =-1 ;
		for ( var i =0 ; i < faceCenters.length ; i++ ) {
			var d =_camera.position.distanceTo (faceCenters [i]) ;
			if ( i0 === -1 || d < d0 ) {
				i0 =i ;
				d0 =d ;
			}
		}
		var position =faceCenters [i0].clone () ;
		var viewDir =center.clone () ;
		viewDir.sub (position) ;
		viewDir.normalize () ;
		position.sub (viewDir.multiplyScalar (5)) ;
		this.navigate (position, faceCenters [i0]) ;

		_viewer.getProperties (evt.dbIdArray [0], function (result) {
			//console.log (result) ;
			var name =result.name || "" ;
			var typeName =findProperty(result.properties, "Type Name") ;
			if ( typeName !== null )
				name =typeName.displayValue ;
			var def ={
				"name": name,
				"icon": "/images/" + name.replace (/\W/g, '-') + "-icon128.png",
				"iconClass": "medium",
				"image": "/images/" + name.replace (/\W/g, '-') + ".png",
				"url": "",
				"position": position,
				"target": center,
				"id": (result.externalId || ""),
				"sensors": {
					"id": "",
					"dbid": evt.dbIdArray [0],
					"position": faceCenters [i0],
					"viewfrom": position,
					"scale": 0.01,
					"rotation": { "x": _camera.rotation._x, "y": _camera.rotation._y, "z": _camera.rotation._z }
				}
			} ;
			console.log (JSON.stringify (def)) ;
		}) ;

	} ;

	findProperty =function (properties, displayName) {
		for ( var i =0 ; i < properties.length ; i++ ) {
			if (   properties [i].hasOwnProperty ('displayName')
				&& properties [i] ['displayName'] === displayName
			)
				return (properties [i]) ;
		}
		return (null) ;
	} ;

    this.createSensorMarkers =function () {
        var self =this ;
		if ( this.poiNavigationMenu === undefined )
			return ;
		$('div.sensor-markers').remove () ;
        for ( var key in oPOI ) {
            var poi =oPOI [key] ;
			//var id =key.replace (/\W/g, '') ;
            var screenPoint =_self.worldToScreen (poi.sensors.position, self.camera ()) ;
            //var offset =self.getClientOffset (self.container ()) ;
            $(document.createElement ('div'))
                //.attr ('class', '')
                .attr ('id', key)
				.attr ('title', 'Sensor ID: ' + key + ' [' + oPOI [key].name + ']')
				.attr ('class', 'sensor-markers')
                .css ('width', '32px').css ('height', '32px')
                .css ('position', 'absolute').css ('top', (screenPoint.y + 'px')).css ('left', (screenPoint.x + 'px'))
                .css ('background', 'transparent url(/images/sensortag.png) no-repeat')
                .css ('pointer-events', 'auto').css ('cursor', 'pointer')
                .css ('z-index', '4')
                .appendTo (this.poiNavigationMenu)
                .click (function (evt) {
                    evt.preventDefault () ;
                    var sensorid =$(evt.target).attr ('id') ;
                    self.navigate (oPOI [sensorid].sensors.viewfrom, oPOI [sensorid].sensors.position) ;
                    if ( _sensorPanels [sensorid] === undefined ) {
                        _sensorPanels [sensorid] =new Autodesk.Viewing.Extensions.IoTTool.SensorPanel (sensorid, _self) ;
                        _sensorPanels [sensorid].initializeFeeds () ;
                    }
                    self.activateSensorPanel (_sensorPanels [sensorid]) ;
                }) ;
        }
    } ;

    this.onCameraChanged =function (evt) {
        var self =this ;
        _navapi.toPerspective () ;
        _navapi.setVerticalFov (75, true) ;

		var boxes =[] ;
        for ( var key in oPOI ) {
            var poi =oPOI [key] ;
            var screenPoint =_self.worldToScreen (poi.sensors.position, self.camera ()) ;
            //var offset =self.getClientOffset (self.container ()) ;

            var elt =$('div#' + key) ;
			elt.css ('top', (screenPoint.y + 'px')).css ('left', (screenPoint.x + 'px')) ;

			boxes.push ({
				x: elt.position ().left, y: elt.position ().top,
				width: elt.outerWidth (false), height: elt.outerHeight (false)
			}) ;
        }

		// Now check the menu does not overlap markers
		var menuImg =this.poiNavigationMenu.children ('div.menu-selector') ;
		menuImg.css ('left', '50%').css ('top', '50%') ;
		var rect ={
			x: (menuImg.position ().left + parseFloat (menuImg.css ('margin-left'))),
			y: (menuImg.position ().top + parseFloat (menuImg.css ('margin-top'))),
			width: menuImg.outerWidth (false), height: menuImg.outerHeight (false)
		} ;
		for ( var i =0 ; i < boxes.length ; i++ ) {
			while ( this.intersects (rect, boxes [i]) ) {
				rect.x +=32 ;
				//rect.y -=16 ;
				i =-1 ;
				//console.log (rect) ;
				break ;
			}
		}
		menuImg.css ('left', rect.x + 'px').css ('top', rect.y + 'px') ;
    } ;

	this.overlap =function (rect1, rect2) {
		return (
			   rect1.x < rect2.x + rect2.width
			&& rect1.x + rect1.width > rect2.x

			&& rect1.y + rect1.height > rect2.y //<
			&& rect1.y < rect2.y + rect2.height //>
		) ;
	} ;

	this.intersects =function (rect1, rect2) {
		return (!(
			   rect1.x > rect2.x + rect2.width
			|| rect1.x + rect1.width < rect2.x

			|| rect1.y + rect1.height < rect2.y
			|| rect1.y > rect2.y + rect2.height
		)) ;
	} ;

	this.onViewportSizeChanged =function () {
		if ( this.poiNavigationMenu !== undefined )
			this.poiNavigationMenu.css ('width', _container.outerWidth ()).css ('height', _container.outerHeight ()) ;
		this.onCameraChanged (null) ;
	} ;

    this.normalizeCoords =function (screenPoint) {
        var viewport =viewer.navigation.getScreenViewport () ;
        return ({
            x: (screenPoint.x - viewport.left) / viewport.width,
            y: (screenPoint.y - viewport.top) / viewport.height
        }) ;
    } ;

    this.worldToScreen =function (worldPoint, camera) {
        var p =new THREE.Vector4 (worldPoint.x, worldPoint.y, worldPoint.z, 1.0) ;
        p.applyMatrix4 (camera.matrixWorldInverse) ;
        p.applyMatrix4 (camera.projectionMatrix) ;
        // Don't want to mirror values with negative z (behind camera) if camera is inside the bounding box,
        // better to throw markers to the screen sides.
        if ( p.w > 0 ) {
            p.x /=p.w ;
            p.y /=p.w ;
            p.z /=p.w ;
        }
        // This one is multiplying by width/2 and Ã¢â‚¬â€œheight/2, and offsetting by canvas location
        var point =viewer.impl.viewportToClient (p.x, p.y) ;
        // snap to the center of the pixel
        point.x =Math.floor (point.x) + 0.5 ;
        point.y =Math.floor (point.y) + 0.5 ;
        return (point) ;
    } ;

    this.screenToWorld =function (event) {
        var screenPoint ={
            x: event.clientX,
            y: event.clientY
        } ;
        var viewport =viewer.navigation.getScreenViewport () ;
        var n ={
            x: (screenPoint.x - viewport.left) / viewport.width,
            y: (screenPoint.y - viewport.top) / viewport.height
        } ;
        return (viewer.navigation.getWorldPoint (n.x, n.y)) ;
    } ;

    this.getClientOffset =function (element) {
        var x = 0, y =0 ;
        while ( element ) {
            x +=element.offsetLeft - element.scrollLeft + element.clientLeft ;
            y +=element.offsetTop - element.scrollTop + element.clientTop ;
            element =element.offsetParent ;
        }
        return ({ 'x': x, 'y': y }) ;
    } ;

    this.activatePOINavigation =function () {
        this.poiNavigationMenu.css ('display', 'block') ;
		this.webpage.webpage.css ('display', 'none') ;
        $('div[id*=-panel]').css ('display', 'none') ;
		this.onViewportSizeChanged () ;
		//this.onCameraChanged (null) ; // It is called from onViewportSizeChanged()
    } ;

	this.activateWebpageNavigation =function () {
		this.poiNavigationMenu.css ('display', 'none') ;
		this.webpage.webpage.css ('display', 'block') ;
		$('div[id*=-panel]').css ('display', 'none') ;
	} ;

    this.activateSensorPanel =function (panel) {
        this.poiNavigationMenu.css ('display', 'none') ;
		this.webpage.webpage.css ('display', 'none') ;
        panel.activate () ;
    } ;

	this.hideUIElements =function () {
		this.poiNavigationMenu.css ('display', 'none') ;
		this.webpage.webpage.css ('display', 'none') ;
		$('div[id*=-panel]').css ('display', 'none') ;
	} ;

} ;


// Sensor Panel
Autodesk.Viewing.Extensions.IoTTool.SensorPanel =function (sensorid, iotTool) {
    var _self =this ;
    var _tool =iotTool ; this.tool =function () { return (_tool) ; } ;
    var _sensorid =sensorid ; this.sensorid =function () { return (_sensorid) ; } ;

    var _scene =new THREE.Scene () ; this.scene =function () { return (_scene) ; } ;
    //var _panel =this.createSensorWall (sensors [sensorid] ['sensor'], sensorid) ; this.panel =function () { return (_panel) ; } ;
    var _charts =[] ; this.charts =function () { return (_charts) ; } ;

    this.createSensorWall =function (sensor, sensorid) {
        var self =this ;
        // HTML
        var element =$(document.createElement ('div'))
            .attr ('id', sensorid + '-panel')
            //.html ('Plain text inside a div')
            //.css ('z-index', 4)
            .attr ('class', 'three-div')
            .click (function (evt) {
                evt.preventDefault () ;
                var panel =$(evt.target).parents ('div[id*=-panel]') ;
                if ( panel.length == 0 )
                    panel =$(evt.target) ;
                panel.css ('display', 'none') ;
                panel.css ('pointer-events', 'none') ;
                $('#' + panel.attr ('id').split ('-') [0]).css ('display', 'block') ;
                _tool.activatePOINavigation () ;
            })
			.bind ('mousewheel', function (evt) {
				evt.preventDefault () ;
				_tool.viewer ().toolController.mousewheel (evt.originalEvent) ;
			}) ;
        // CSS Object
        var div =new THREE.CSS3DObject (element [0]) ;
        div.position.set (sensor.position.x, sensor.position.y, sensor.position.z) ;
        div.rotation.set (sensor.rotation.x, sensor.rotation.y, sensor.rotation.z) ; // Math.PI / 2 ;
        div.scale.set (sensor.scale, sensor.scale, sensor.scale) ;
        _scene.add (div) ;

        return (element) ;
    } ;

    var _panel =this.createSensorWall (oPOI [sensorid] ['sensors'], sensorid) ; this.panel =function () { return (_panel) ; } ;

    this.initializeFeeds =function () {
        _panel.empty () ;

        var h3 =$(document.createElement ('h3'))
            .html ('Sensor ID: ' + _sensorid)
            .appendTo (_panel) ;

        var options ={
            width: 200, height: 200,
            redFrom: 80, redTo: 85,
            yellowFrom: 75, yellowTo: 80, //yellowColor: '#0d0dd5',
            minorTicks: 5, min: _colorRanges ["tmp"].min, max: _colorRanges ["tmp"].max
        } ;
        _charts ['Temperature'] =this.createGaugeFeeds ('Temperature', options) ;

		_charts ['Temp'] =this.createPatchFeeds ('Temp', {}) ;

		options ={
			width: 200, height: 200,
			minorTicks: 5, min: _colorRanges ["lux"].min, max: _colorRanges ["lux"].max
		} ;
		_charts ['Light'] =this.createGaugeFeeds ('Light', options) ;

		options ={
			width: 200, height: 200,
			min: -2, max: 2
		} ;
		_charts ['Motion (X)'] =this.createGaugeFeeds ('Motion (X)', options) ;
		_charts ['Motion (Y)'] =this.createGaugeFeeds ('Motion (Y)', options) ;
		_charts ['Motion (Z)'] =this.createGaugeFeeds ('Motion (Z)', options) ;

		_charts ['Gyro (X)'] =this.createGaugeFeeds ('Gyro (X)', options) ;
		_charts ['Gyro (Y)'] =this.createGaugeFeeds ('Gyro (Y)', options) ;
		_charts ['Gyro (Z)'] =this.createGaugeFeeds ('Gyro (Z)', options) ;

        /*options ={
            width: 200, height: 200,
            redFrom: 80, redTo: 100,
            yellowFrom: 0, yellowTo: 20,
            minorTicks: 5, min: 0, max: 100
        } ;
        _charts ['Humidity'] =this.createGaugeFeeds ('Humidity', options) ;*/

        /*options ={
            width: 200, height: 200,
            redFrom: 30, redTo: 40,
            yellowFrom: -10, yellowTo: 0, yellowColor: '#0d0dd5',
            minorTicks: 5, min: -10, max: 40
        } ;
        _charts ['Object Temp'] =this.createGaugeFeeds ('Object Temp', options) ;*/

        /*options ={
            width: 200, height: 200,
            greenFrom: 990, greenTo: 1100,
            minorTicks: 50, min: 800, max: 1200
        } ;
        _charts ['Pressure'] =this.createGaugeFeeds ('Pressure', options) ;*/

        //_charts ['Object Temp2'] =this.createSmoothieFeeds ('Live') ;
    } ;

    this.updateFeeds =function (label, value) {
        if ( _charts [label] === undefined )
            return ;
        if ( _charts [label].hasOwnProperty ('gauge') ) {
            _charts [label].data.setValue (0, 1, value) ;
            _charts [label].gauge.draw (_charts [label].data, _charts [label].options) ;
        } else if (_charts [label].hasOwnProperty ('smoothie') ) {
            _charts [label].serie.append (new Date ().getTime (), value) ;
		} else if (_charts [label].hasOwnProperty ('patch') ) {
			_charts [label].patch
				.css ('background-color', this.getTemperatureColor (value, _colorRanges ["tmp"])) ;
			_charts [label].text
				.text (value) ;
		}
    } ;

    this.createGaugeFeeds =function (label, options) {
        var data =google.visualization.arrayToDataTable ([
            [ 'Label', 'Value' ],
            [ label, 20 ]
        ]) ;
        var tempOptions ={
            width: 200, height: 200,
            minorTicks: 5,
        } ;
        options =$.extend (tempOptions, options) ;

        var id =_sensorid + '-' + label.replace (/\W/g, '') ;
        var tempDiv =$(document.createElement ('div'))
            .attr ('class', 'panel-elt')
            .attr ('id', id)
            //.html (label)
            .appendTo (_panel) ;

        var chart =new google.visualization.Gauge (tempDiv [0]) ;
        chart.draw (data, tempOptions) ;
        return ({ 'gauge': chart, 'data': data, 'options': options }) ;
    } ;

    this.createSmoothieFeeds =function (label, options) { // canvas
        var id =_sensorid + '-' + label.replace (/\W/g, '') ;
        var tempDiv =$(document.createElement ('canvas'))
            .attr ('class', 'panel-elt-smoothie')
            .attr ('width', '400px')
            .attr ('height', '200px')
            .attr ('id', id)
            //.html (label)
            .appendTo (_panel) ;
            //.appendTo ($('#chart_div'))

        var chart =new SmoothieChart ({
            //grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
            //    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
            //labels: { fillStyle:'rgb(60, 0, 0)' }

            grid: { fillStyle: 'rgba(0,0,0,0.52)', verticalSections: 4, millisPerLine: 1000 },
            millisPerPixel: 20,
            //timestampFormatter: SmoothieChart.timeFormatter,
            minValue: 0,
            maxValue: 50
        }) ;
        chart.streamTo (tempDiv [0]) ;

        // Data
        var data =new TimeSeries () ;

        // Add to SmoothieChart
        chart.addTimeSeries (data, { lineWidth: 2, strokeStyle: 'rgba(0,255,0,0.92)', fillStyle: 'rgba(58,133,70,0.83)' }) ;

        return ({ 'smoothie': chart, 'serie': data }) ;
    } ;

	// Temperature colors from low (blue) to high (red)
	var _colorTempDict =[
		"#0000ff", "#0055ff", "#00aaff", "#00ffff", "#00ffaa", "#00ff55",
		"#00ff00", "#55ff00", "#aaff00", "#ffff00", "#ffaa00", "#ff5500", "#ff0000"
	] ;

	var _colorRanges ={
		"tmp": { "min": 50, "max": 85 },
		"lux": { "min": 100, "max": 400 }
	} ;

	this.getTemperatureColor =function  (temp, range) {
		var steps =_colorTempDict.length ;
		if ( steps < 2 ) {
			console.log ("ERROR: Color Temp dictionary < 2") ;
			return (0) ;
		}
		var stepTemp =(range.max - range.min) / (steps - 1) ;
		var index =Math.floor ((temp - range.min) / stepTemp) ;
		index =Math.max (0, Math.min (index, steps - 1)) ;
		return (_colorTempDict [index]) ;
	} ;

	this.createPatchFeeds =function (label, options) {
		var id =_sensorid + '-' + label.replace (/\W/g, '') ;
		var tempDiv =$(document.createElement ('div'))
			.attr ('class', 'panel-elt patch-host')
			.attr ('id', id)
			//.text ('...')
			.appendTo (_panel) ;

		var chart =$(document.createElement ('div'))
			.attr ('class', 'panel-elt-patch')
			//.attr ('width', '150px')
			//.attr ('height', '100px')
			//.text ('...')
			.appendTo (tempDiv) ;
		var text =$(document.createElement ('span'))
			.text ('...')
			.appendTo (chart) ;

		return ({ 'patch': chart, 'text': text }) ;
	} ;

    this.activate =function () {
        _panel.css ('display', 'block') ;
        //_panel.css ('pointer-events', 'auto') ;
    } ;

} ;


// Utilities
function guid () {
    function s4 () {
        return (Math.floor ((1 + Math.random ()) * 0x10000)
            .toString (16)
            .substring (1)
        ) ;
    }
    return (s4 () + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + s4 () + s4 ()) ;
}
