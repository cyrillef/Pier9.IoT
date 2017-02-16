//
// Copyright (c) Autodesk, Inc. All rights reserved
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
//
// by Cyrille Fauvel - Autodesk Developer Network (ADN)
//
var express =require ('express') ;
var mqtt =require ('mqtt') ;
var moment =require ('moment') ;
var sendMail =require ('./sendMail') ;
var config =require ('./config') ;

var astro =require (__dirname + '/../www/data/mqtt.json') ;
var url =(process.env.NODE_ENV === 'production' ? 'wss' : 'ws') + '://' + astro.mqtt.host + ':' + astro.mqtt.port ;

var client =mqtt.connect (url) ;
//var astroBeginTime =moment ().subtract (7, 'days') ;
var astroLastTime =moment () ;
var astroInterval =resetAstroInterval () ;

client.on ('connect', function () {
	client.subscribe (astro.topic + '/#') ;
}) ;

client.on ('error', function (err) {
	console.log (err) ;
	client.end () ;

	sendMail ({
		'from': config.MJ_ACCOUNT,
		'replyTo': config.MJ_ACCOUNT,
		'to': config.mailTo,
		'subject': 'pier9.autodesk.io - MQTT error',
		'html': err
	}) ;
	clearInterval (astroInterval) ;
	astroInterval =null ;

}) ;

client.on ('message', function (topic, message) { // message is Buffer
	//console.log (message.toString ()) ;
	astroLastTime =moment () ;
	bMsgSent =false ;
}) ;

function resetAstroInterval () {
	astroLastTime =moment () ;
	if ( astroInterval )
		clearInterval (astroInterval) ;
	astroInterval =setInterval (astroIntervalElapsed, moment.duration (1, 'hours').asMilliseconds ()) ;
	//astroInterval =setInterval (astroIntervalElapsed, 2000) ;
	return (astroInterval) ;
}

var bMsgSent =false ;
function astroIntervalElapsed () {
	var diff =moment ().diff (moment (astroLastTime)) ;
	var minutes =moment.duration (diff).asMinutes () ;
	if ( minutes > 30 && bMsgSent === false ) {
		bMsgSent =true ;
		sendMail ({
			'from': config.MJ_ACCOUNT,
			'replyTo': config.MJ_ACCOUNT,
			'to': config.mailTo,
			'subject': 'pier9.autodesk.io - MQTT no message for the last ' + minutes + ' minutes',
			'html': 'last message was received at ' + moment (astroLastTime).calendar ()
		}) ;
	}
}

module.exports =client ;
