'use strict';

var events 	= require('events');
var util 	= require('util');
var fs      = require("fs");

module.exports = SwrResult;
function SwrResult(record){
	
	this.record = record;
    events.EventEmitter.call(this); // call super class constructor
	this.func = this.on;
	this.event = this.on;
	
	console.log( 'Create SwrResult()' );
	
	this.log_root = "/data/results/";
	this.log_ext  = ".log";
	
	this.func('open',   this.on_open.bind(this) );
	this.func('close',  this.on_close.bind(this) );
	this.func('stdout', this.on_write.bind(this) );
	this.func('stderr', this.on_write.bind(this) );
	this.func('stdin',  this.on_stdin.bind(this) );
	
	 // 결과 디렉토리 체크 및 생성
	try{ fs.accessSync(this.log_root); }catch(e){ fs.mkdirSync(this.log_root); }

}

util.inherits(SwrResult,events.EventEmitter);

//  전체 파일 이름을 얻는다. 
SwrResult.prototype.getPath = function getPath(filename) {
	
    var full_filename = this.log_root 
		             + filename 
					 + this.log_ext;
	
	return full_filename;
}

//  로그를 연다. 
SwrResult.prototype.on_open = function on_open(filename) {
	var self = this;
	
	console.log( 'CALL SwrResult.prototype.open()' );
	
    var log_filename = this.getPath( filename );
		
	console.log( log_filename );
	this.writableStream = fs.createWriteStream( log_filename );
	
	var log = this.writableStream;
	log.write( '{'         + '\n' );
	
	var textobj =  '"info" :'  + JSON.stringify(this.record) + ',\n';
	log.write( textobj  );
	
	log.write( '"log" : ['         + '\n' );

	this.stdout_remaining      = '';
	this.stdout_remaining_time = 0;
	this.log_seq               = 0;

	var logstart = { seq : 0, time : Number(new Date()), cmd : "logstart", data : "start" };
	var textlogstart =  '        ' 
	             + JSON.stringify(logstart)
				 + ','
				 + '\n';
	
	log.write(textlogstart);
		
	return this;
}

// 로그를 닫는다.
SwrResult.prototype.on_close = function on_close() {

	var self = this;
	
	var log = this.writableStream;
		
	this.write_stdout_remaining();
		
	var log_seq = this.log_seq + 1;
	              this.log_seq++;
					  
	var log_time = Number(new Date());
		
	var logend = { seq : log_seq, time : log_time, cmd : "logend", data : "end" };
	var textlogend =  '        ' 
	               + JSON.stringify(logend)
				   + '\n';
		
	log.write(textlogend);		
		
	log.write( '        ]'         + '\n' );
	log.write( "}\n" );

	return this;
}

// 로그에 쓴다.
SwrResult.prototype.on_write = function on_write( data ) {

//	console.log( 'CALL SwrResult.prototype.on_write()' );
//	console.log( data );
	
	var self = this;
	
    var log = this.writableStream;
	var str = data.toString('utf8');
	var remaining = this.stdout_remaining;
	
//	console.log( str );

	this.stdout_remaining_time = Number(new Date());
		
	remaining += str;
		
	var index = remaining.indexOf('\n');
	var last  = 0;
		
	while (index > -1) {
		var line = remaining.substring(last, index+1);
		last = index + 1;

		var log_seq = this.log_seq + 1;
		              this.log_seq++;
		var stdout_remaining_time = this.stdout_remaining_time;
			
		var stdout = { seq : log_seq, time : stdout_remaining_time, cmd : "stdout", data : line };
		var textout =  '        ' 
					+ JSON.stringify(stdout)
					+ ','
					+ '\n';
			
		log.write(textout);		
			
		index = remaining.indexOf('\n', last);
	}

	remaining = remaining.substring(last);		
	this.stdout_remaining = remaining;
	if( remaining === '' ){
		this.stdout_remaining_time = 0;
	}		

	return this;
}

// 로그에 쓴다.
SwrResult.prototype.write_stdout_remaining = function write_stdout_remaining() {
		
	var self = this;
	
	var log = this.writableStream;
	var remaining = this.stdout_remaining;
		
	if( remaining !== '' ){
			
//		console.log( 'remaining = ', remaining );	
			
		var log_seq = this.log_seq + 1;
		               this.log_seq++;
		var stdout_remaining_time = this.stdout_remaining_time;
			this.stdout_remaining_time = 0;
						  
		var stdout = { seq : log_seq, time : stdout_remaining_time, cmd : "stdout", data : remaining };
		var textout =  '        ' 
		            + JSON.stringify(stdout)
					+ ','
		    		+ '\n';
		    
		log.write(textout);		
			
		this.stdout_remaining = '';
	}	
		
	return this;
}

// 로그에 표준 입력을 쓴다. 
SwrResult.prototype.on_stdin = function on_stdin( data ) {

	var self = this;
	
	this.write_stdout_remaining();
			
	var log 	= this.writableStream;
	var log_seq = this.log_seq + 1;
		           this.log_seq++;
	var log_time = Number(new Date());
		
	var stdin = { seq : log_seq, time : log_time, cmd : "stdin", data : data };
		
	var textin =  '        ' 
	           + JSON.stringify(stdin)
			   + ','
			   + '\n';
		
	log.write(textin);		

	return this;
}

