var window = this
	, document = this.document;

define(
[
	'event',
],
function (EventEmitter) {

	'use strict';
	
	var Runner = function(options) {
		console.log( 'Create Runner()');
		var self = this;
		
		if (!(this instanceof Runner)) {
			return new Runner(arguments[0], arguments[1], arguments[2]);
		}
		EventEmitter.call(this); // call super class constructor
    	this.func = this.on;
    	this.event = this.on;
		
		this.func('stdout',  this.on_stdout.bind(this) );
		
		this.remainingStr 	= "";
		this.checkString 	= "";
		this.checkStrList 	= [];
		
	//	setTimeout( this.Loop.bind(this), 10 );    
	
	}
	
	inherits(Runner, EventEmitter);
	
	Runner.prototype.Loop= function(){
		
		console.log( "CALL 타이머 이벤트 Loop" );
	//	console.log( this );
		
	//	this.checkStdStr();
		
	//	setTimeout( this.Loop.bind(this), 10 ); 
	}
	
	Runner.prototype.checkStdStr = function(){
		console.log( "CALL Runner.prototype.checkStdStr()" );
	//	console.log( this );
	//	
		console.log( "this.remainingStr(before) = ", this.remainingStr );
	//	console.log( "this.checkString = ", this.checkString );
		
		if( this.checkString === "" && this.checkStrList.length === 0 ){
			this.remainingStr = "";
			return;
		}	
		
		if( this.checkString === "" ){
			this.checkString = this.checkStrList.shift();
		}
		
		if( this.checkString === "" ){
			this.remainingStr = "";
			return;
		}
	
		// 현재까지 받은 문자열안에 있는가?	
		var index = this.remainingStr.indexOf( this.checkString );
		if( index < 0 ){
			// 없다면 마지막 개행문자 이후만 남긴다. 
			var index = this.remainingStr.lastIndexOf( '\n' );
			if( index > -1 ){ 
				this.remainingStr = this.remainingStr.substring(index+1);
			}
			console.log( "this.remainingStr(after-return) = ", this.remainingStr );
			return;
		} 
		
		// 발견했다면 	
		console.log( "Found index =============================== ", index );
	
		// 검사 대상 문자열과 같은 위치까지 제거하고 다음번으로 넘긴다. 
		var last  = index + this.checkString.length;
		this.remainingStr = this.remainingStr.substring(last);
		
		// 검사 대상 문자열도 제거 
		this.checkString = "";
		
		console.log( "this.remainingStr(after) = ", this.remainingStr );
		// 재 호출 
		this.checkStdStr();
		
	}
	
	Runner.prototype.on_stdout = function( str ){
		
		console.log( 'STDOUT 에 대한 처리 [' + str + ']' );
		this.remainingStr += str;
		
		this.checkStdStr();
	
	}
	
	/**
	* Expose
	*/
	
	Runner.wait_prompt = function( str ){
		console.log( '문자열을_기다림() 함수 호출 = ' , str );
		this.checkStrList.push( str );
	}
		
	Runner.input_command = function( str ){
		console.log( '명령을 입력함() 함수 호출 = ' , str );
	}
	
	return Runner;

});

