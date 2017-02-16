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
var crypto =require ('crypto') ;

var config ={
	credentials: {
		// Replace placeholder below by the Consumer Key and Consumer Secret you got from
		// http://developer.autodesk.com/ for the production server
		client_id: process.env.FORGE_CLIENT_ID || '<replace with your consumer key>',
		client_secret: process.env.FORGE_CLIENT_SECRET || '<replace with your consumer secret>',
		grant_type: 'client_credentials',
		scope: [ 'data:read' ]
	},

	bucket: 'pier9-autodesk-io',

	mailTo: process.env.EMAILTO || process.env.MJ_ACCOUNT,

	MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC || '<replace with your mailjet public key>',
	MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE || '<replace with your mailjet private key>',
	MJ_ACCOUNT : process.env.MJ_ACCOUNT || '<replace with your mailjet account name>'

} ;


// Make sure it is a unique bucket name by using the public key
var md5sum =crypto.createHash ('md5').update (config.credentials.client_id).digest ('hex') ;
//console.log (md5sum) ;
if ( md5sum !== '65f502e879a5ee30d13e5a0eee0cea53' )
	config.bucket +=config.credentials.client_id.toLowerCase () ;

module.exports =config ;
