'use strict';

var events 	= require('events');
var util 	= require('util');

module.exports = SwrWebSocket;
function SwrWebSocket(id){
	
    events.EventEmitter.call(this); // call super class constructor
	this.func = this.on;
	this.event = this.on;
	
	console.log( 'Create SwrWebSocket()' );
	console.log( 'id = ', id );
	
	this.connection = {};

	this.func('connect',	this.on_connect.bind(this) );
	this.func('disconnect',	this.on_disconnect.bind(this) );
	this.func('stdout',		this.on_stdout.bind(this) );
	this.func('stderr',		this.on_stderr.bind(this) );
	
	this.event('close',		this.on_close.bind(this) );
	this.event('error',   	this.on_error.bind(this) );
	this.event('stdin',  	this.on_stdin.bind(this) );
	
}

util.inherits(SwrWebSocket,events.EventEmitter);

SwrWebSocket.prototype.on_connect = function on_connect(connection) {
	var self = this;
	
	console.log( 'CALL SwrWebSocket.prototype.on_connect()' );
	this.connection = connection;
	
	// 웹 소켓 데이터 이벤트를 쉘에 연결한다. 
	connection.on('message', function(message) {
		if( message.utf8Data === '\r' ){
			self.emit( "stdin", '\n' );
		} else {
			self.emit( "stdin", message.utf8Data );
		}					
	});
			
	connection.on('close', function(closeReason, description) {
		console.log( 'EVENT WS close' );
		self.emit( "close", closeReason, description );
	});
			
	connection.on('error', function(error) {
		self.emit( "error", error );
	});	
	
	return this;
}

SwrWebSocket.prototype.on_disconnect = function on_disconnect() {
	var self = this;
	
	console.log( 'CALL SwrWebSocket.prototype.on_disconnect()' );
	var connection = this.connection;
	
	// 웹 소켓을 닫는다. 
	connection.close(); 
	
	return this;
}

SwrWebSocket.prototype.on_stdout = function on_stdout(data) {
	var self = this;
	
//	console.log( 'CALL SwrWebSocket.prototype.on_stdout()' );
	this.connection.sendUTF( data );
	
	return this;
}

SwrWebSocket.prototype.on_stderr = function on_stderr(data) {
	var self = this;
	
	console.log( 'CALL SwrWebSocket.prototype.on_stderr()' );
	
	return this;
}

SwrWebSocket.prototype.on_stdin = function on_stdin(data) {
	var self = this;
	
//	console.log( 'CALL SwrWebSocket.prototype.on_stdin()' );
	
	return this;
}

SwrWebSocket.prototype.on_close = function on_close(closeReason, description) {
	var self = this;
	
	console.log( 'CALL SwrWebSocket.prototype.on_close()' );
	
	return this;
}


SwrWebSocket.prototype.on_error = function on_error(error) {
	var self = this;
	
	console.log( 'CALL SwrWebSocket.prototype.on_error()' );
	console.log('Connection error for peer ' + connection.remoteAddress + ': ' + error);
	
	return this;
}

