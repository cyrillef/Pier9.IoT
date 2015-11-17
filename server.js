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
var express =require ('express') ;
var app =express () ;

//var morgan =require ('morgan') ; // logging
// app.use (morgan ('combined')) ;

// Webpages server
app.use (function (req, res, next) {
	res.header ("Access-Control-Allow-Origin", "*") ;
	res.header ("Access-Control-Allow-Headers", "X-Requested-With") ;
	next () ;
}) ;

app.use (express.static (__dirname + '/html')) ;

// Rest API
var vad =require ('view-and-data') ;
var lmv =new vad (require ('./node_modules/view-and-data/config-view-and-data')) ;

app.get ('/auth', function (req, res) {
	lmv.getToken ()
		.then (function (data) {
			res.json (data);
		}, function () {
			// errback, executed on rejection
		}) ;
}) ;

/////////////////////////////////////////////////////////////////////////////////
app.set ('port', process.env.PORT || 8080) ;
var server =app.listen (app.get ('port'), function () {
	console.log ('Server listening on port ' + server.address ().port) ;
}) ;