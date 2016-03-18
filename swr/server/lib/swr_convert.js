
'use strict';

var fs = require('fs');

module.exports = swr_convert;

function swr_convert(log_filename, options) {
	var default_options = {
		
	};
	
	console.log( 'CALL swr_convert()' );
	console.log( 'log_filename = ', log_filename );
	
	
	var log_obj = JSON.parse( fs.readFileSync( log_filename, 'utf8'));	
//	console.log( log_obj );
	
	var before_command = 'ready';
	log_obj.log.every(function(entry) {
		
//		console.log(entry);
		if        ( entry.logstart ){
			// 시작 커맨트 키이다. 
			console.log( "ok logstart" );
			before_command = 'logstart';
			
		} else if ( entry.logend  ) {
			
			// 종료 커맨트 키이다. 
			console.log( "ok logend" );
			before_command = 'logend';
			return false;
			
		} else 	if( entry.stdout ){
			
			// 표준 출력 커맨드 키이다. 
			
			if( before_command === 'stdin' ){
				
				
			} else {
			    console.log( "ok stdout" );	
			}
			before_command = 'stdout';
			
		} else if ( entry.stdin  ) {
			
			// 표준 입력 커맨드 키이다. 
			console.log( "ok stdin" );
			before_command = 'stdin';
			
		} 
		else {
			
			console.log( "unknow command key" );
			return false;
			
		}
		return true;
		
	});
	
	
	return null;
}

