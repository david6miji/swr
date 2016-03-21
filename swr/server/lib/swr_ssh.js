'use strict';

var events 	= require('events');
var util 	= require('util');

var Client = require('ssh2').Client;

module.exports = SwrSSH;
function SwrSSH(options){
	options = this.options = options || {};
    events.EventEmitter.call(this); // call super class constructor
	this.func = this.on;
	this.event = this.on;
	
	this.SSHShell = new Client();
	
	console.log( 'Create SwrSSH()' );
	
	this.func('connect',	this.on_connect.bind(this) );
	this.func('disconnect',	this.on_disconnect.bind(this) );
	this.func('stdin',		this.on_stdin.bind(this) );

	this.event('open',    this.on_open.bind(this) );
	this.event('close',   this.on_close.bind(this) );
	this.event('stdout',  this.on_stdout.bind(this) );
	this.event('stderr',  this.on_stderr.bind(this) );
	
	this.SSHShell.on('error', this.errorSSHShell.bind(this) );
	this.SSHShell.on('ready', this.readySSHShell.bind(this) );

}

util.inherits(SwrSSH,events.EventEmitter);

//  클라이언트에 접속한다. 
SwrSSH.prototype.on_connect = function on_connect(host,port,username,password) {
	var self = this;
	
	// 쉘을 실행한다. 
	this.SSHShell.connect({
		host: host,
		port: port,
		username: username,
		password: password
	});
	
	return this;
}

//  클라이언트 접속을 끊는다. 
SwrSSH.prototype.on_disconnect = function on_disconnect() {
	var self = this;
	
	// 쉘을 종료한다. 
	this.SSHShell.end();
	
	return this;
}

// 클라이언트 에러가 발생하였다.
SwrSSH.prototype.errorSSHShell = function errorSSHShell(err) {
	var self = this;
	
	console.log( 'Event error - SwrSSH.errorSSHShell()' );
	console.log( 'err = ', err );
	
	// 에러 처리를 나중에 추가 한다. 

	return this;
}

// 클라이언트에 접속 되었다. 
SwrSSH.prototype.readySSHShell = function readySSHShell() {
	var self = this;
	
	console.log( 'Event ready - SwrSSH.readySSHShell()' );

	this.SSHShell.shell(function(err, stream) {
		if (err) {
				//	throw err;
				// 에러 처리를 한다. 
		}	
		
		self.stream = stream;
		self.emit( 'open' );
		
		// 쉘이 종료 되었을때의 처리 
		stream.on('close', function() {
			self.emit( 'close' );
			self.SSHShell.end();
		});

		// 쉘의 표준 출력 처리 
		stream.on('data', function(data) {
			self.emit( 'stdout', data );
		});
					
		// 쉘의 표준  에러 처리 
		stream.stderr.on('data', function(data) {
			self.emit( 'stderr', data );
		});
		
	});

	return this;
}

// 쉘에 표준 입력을 전달한다.
SwrSSH.prototype.on_stdin = function on_stdin( data ) {

	var self = this;
	
	if( this.stream ){
		this.stream.write( data );
	}

	return this;
}

// 쉘이 열렸다.
SwrSSH.prototype.on_open = function on_open() {

	var self = this;
	
	console.log( 'CALL SwrSSH.prototype.on_open()' );
	
	return this;
}

// 쉘이 종료 되었다. 
SwrSSH.prototype.on_close = function on_close() {

	var self = this;
	console.log( 'CALL SwrSSH.prototype.on_close()' );
	
	return this;
}

// 쉘에서 표준 출력이 발생하였다. 
SwrSSH.prototype.on_stdout = function on_stdout(data) {

	var self = this;
	
	return this;
}
// 쉘에서 표준 에러 출력이 발생하였다. 
SwrSSH.prototype.on_stderr = function on_stderr(data) {

	var self = this;
	console.log( 'CALL SwrSSH.prototype.on_stdout()' );
	
	return this;
}

