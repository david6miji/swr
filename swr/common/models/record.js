var os 				= require('os');
var path 			= require('path');
var fs 				= require("fs");
var Client 			= require('ssh2').Client;
var app 			= require('../../server/server');
var SwrLog 			= require('../../server/lib/swr_log');
var SwrRecording 	= require('../../server/lib/swr_recording');
var SwrPlaying 	    = require('../../server/lib/swr_playing');

var swr_convert = require('../../server/lib/swr_convert');

module.exports = function(Record) {
	
	var swrRecoding	= new SwrRecording();
	var swrPlaying	= new SwrPlaying();
	
    Record.createSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.createSSHRecord - data = ', data );
		
		Record.findById(data.id)
		.then(function(record){
			
			swrRecoding.emit( "create" , record );
			var response = { ack : 'ok' };
			cb(null, response);
			
		})
		.catch(function(err){
			console.log( 'err = ', err );
			var response = { ack : 'fail' };
			cb(null, response);
			
		})

    };
	
    Record.remoteMethod(
        'createSSHRecord',
        {
          http: {path: '/createSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );

    Record.destroySSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.destroySSHRecord - data = ', data );
		
		swrRecoding.emit( "destroy" , data.id );
		
		var response = { ack : 'ok' };
		cb(null, response);
		
    };
	
    Record.remoteMethod(
        'destroySSHRecord',
        {
          http: {path: '/destroySSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	
    Record.createSSHPlay = function( data, cb) {
    	console.log( 'Call method : Record.createSSHPlay - data = ', data );
		
		Record.findById(data.id)
		.then(function(record){
			
			swrPlaying.emit( "create" , record );
			var response = { ack : 'ok' };
			cb(null, response);

		})
		.catch(function(err){
			console.log( 'err = ', err );
			var response = { ack : 'fail' };
			cb(null, response);
			
		})

    };
	
    Record.remoteMethod(
        'createSSHPlay',
        {
          http: {path: '/createSSHPlay', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );

    Record.destroySSHPlay = function( data, cb) {
    	console.log( 'Call method : Record.destroySSHPlay - data = ', data );
		
		swrPlaying.emit( "destroy" , data.id );
		
		var response = { ack : 'ok' };
		cb(null, response);
		
    };
	
    Record.remoteMethod(
        'destroySSHPlay',
        {
          http: {path: '/destroySSHPlay', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	
	
    Record.fileLogSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.fileLogSSHRecord - data = ', data );
		var id          = data.id;

		// id 에 해당하는 레코드 정보를 얻어 온다. 
		Record.findById(data.id, function(err,record) {
			console.log( "CB Record.findById"  );
			if( err ){
			    console.log( 'err = ', err );	
				var response = { ack : 'fail' };
				cb(null, response);
				
			} else {
			    console.log( record );	
				
				var log_filename = ( new SwrLog( record )).getPath( id );
				console.log( 'log_filename = ', log_filename );
				
				var log_obj = JSON.parse( fs.readFileSync( log_filename, 'utf8'));	
				
				var response = { ack : 'ok', content : log_obj };
				cb(null, response);
			}

		});

    };
	
    Record.remoteMethod(
        'fileLogSSHRecord',
        {
          http: {path: '/fileLogSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );	
	
    Record.fileRunSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.fileRunSSHRecord - data = ', data );
		var id          = data.id;
		console.log( 'id = ', id );
		
		
		// 실행 스크립트 파일 이름을 얻는다. 
		var log_filename = '/data/runs/'
						 + 'prg_test.js' ;
		
		var log_file = fs.readFileSync( log_filename, 'utf8');	
				
		var response = { ack : 'ok', content : log_file };
		cb(null, response);
		
    };
	
    Record.remoteMethod(
        'fileRunSSHRecord',
        {
          http: {path: '/fileRunSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	

    Record.convertLogSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.convertLogSSHRecord - data = ', data );
		
		// 쉘과 종료 처리를 한다 
		var id          = data.id;
		
		// id 에 해당하는 레코드 정보를 얻어 온다. 
		Record.findById(data.id, function(err,record) {
			console.log( "CB Record.findById"  );
			if( err ){
			    console.log( 'err = ', err );	
				var response = { ack : 'fail' };
				cb(null, response);
			} else {
			    console.log( record );	
				
				
				// 로그 파일 이름을 얻는다. 
				var log_filename = log_root 
								 + record.filename 
								 + log_ext;
		
				swr_convert( log_filename );
				
				var response = { ack : 'ok' };
				cb(null, response);
			}
			
		});
		
    };
	
    Record.remoteMethod(
        'convertLogSSHRecord',
        {
          http: {path: '/convertLogSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );

};

