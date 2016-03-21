'use strict';

var events 	= require('events');
var util 	= require('util');

module.exports = LinkEvent;
function LinkEvent( src, src_event, target, target_event, transform ){

//	console.log( 'CALL LinkEvent()' );
	
	src.on( src_event, function () {
//		console.log( 'EVENT LinkEvent() - ', event );
//		console.log( arguments );
		
		if( !transform ) {
			transform = LinkEventTransForm;
		}
		var next_arguments = transform( target_event, arguments );
			
		target.emit.apply( target, next_arguments );
	});

}

function LinkEventTransForm( event, args ) {

	var self = this;
	
	var next_arguments = Array.prototype.slice.call(args);
		next_arguments.unshift( event );

	return next_arguments;
}

