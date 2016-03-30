var window = this
	, document = this.document;

if(!!window.Worker){
      console.log("이 브라우저는 웹 워커를 지원합니다")
}
else{
      console.log("이 브라우저는 웹 워커를 지원하지 않습니다")
}
	
define(
[
	'event',
],
function (EventEmitter) {

	'use strict';

	var RunnerWorkerFilename = "/js/runner_worker.js";	
	var Runner = function(options) {
		var self = this;
		
		if (!(this instanceof Runner)) {
			return new Runner(arguments[0], arguments[1], arguments[2]);
		}
		EventEmitter.call(this); // call super class constructor
    	this.func = this.on;
    	this.event = this.on;
		
		this.func('stdout',  this.fn_stdout.bind(this) );
		this.on  ('stdin',	  this.on_stdin.bind(this) );
		
		if(!!window.Worker){
			
			// 워커가 이미 존재하면 종료하고 새로운 워커 생성
			if(this.worker) this.worker.terminate();      
			this.worker = new Worker(RunnerWorkerFilename);  	
						
			//워커로부터 전달되는 메시지를 받는다
			this.worker.onmessage = function(event){ 
				
				var req = event.data;
				console.log( "worker request = ", req );
				
				if( req.cmd === 'input_command' ){
					self.emit( 'stdin', req.params.str );
				}
				
			};
			this.worker.onerror = function(event){ 
//				console.log( "worker error!!");
//				console.log( "worker error = ", event );
//				console.log( "worker filename = ", event.filename );
//				console.log( "worker lineno = "  , event.lineno   );
//				console.log( "worker message = "  , event.message );
			};

			// 초기화 처리를 한다. 
			this.worker.postMessage( { cmd : "init" } ); 
		}
		else{
			alert("현재 브라우저는 웹 워커를 지원하지 않습니다")
		}		
		
	}
	
	inherits(Runner, EventEmitter);
	
	
	Runner.prototype.fn_stdout = function( str ){
		
//		console.log( 'STDOUT 에 대한 처리 [' + str + ']' );
		this.worker.postMessage( { cmd : "stdout", params : str } );
	
	}
	
	Runner.prototype.on_stdin = function( str ){
		
		console.log( 'STDIN 에 대한 처리 [' + str + ']' );
//		this.worker.postMessage( { cmd : "stdout", params : str } );
	
	}
	
	// Expose
	
	Runner.wait_prompt = function( str ){
		console.log( '문자열을_기다림() 함수 호출 = ' , str );
		this.worker.postMessage( { cmd : "wait_prompt", params : str } );
	}
		
	Runner.input_command = function( str ){
		console.log( '명령을 입력함() 함수 호출 = ' , str );
		this.worker.postMessage( { cmd : "input_command", params : str } ); 		
	}
	
	return Runner;

});

