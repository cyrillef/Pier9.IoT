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
window.radialMenu ={
	'angleStart': -360,

	// jquery rotate animation
	'rotate': function (li, d) {
		$({ d: this.angleStart }).animate ({ d: d }, {
			step: function (now) {
				$(li)
					.css ({ transform: 'rotate(' + now + 'deg)' })
					.find ('label')
					.css ({ transform: 'rotate(' + (-now) + 'deg)' }) ;
			},
			duration: 0
		}) ;
	},

	// show / hide the options
	'toggleOptions': function (s) {
		$(s).toggleClass ('open');
		var li =$(s).find ('li') ;
		var deg =$(s).hasClass ('half') ? 180 / (li.length - 1) : 360 / li.length ;
		for ( var i =0 ; i < li.length ; i++ ) {
			var d =$(s).hasClass ('half') ? (i * deg) - 90 : i * deg ;
			$(s).hasClass ('open') ? this.rotate (li [i], d) : this.rotate (li [i], this.angleStart) ;
		}
	}

} ;
