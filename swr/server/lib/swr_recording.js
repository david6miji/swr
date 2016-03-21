'use strict';

var events 	= require('events');
var util 	= require('util');

var LinkEvent 		= require('../../server/lib/link_event');
var SwrLog 			= require('../../server/lib/swr_log');
var SwrSSH 			= require('../../server/lib/swr_ssh');
var SwrWebSocket 	= require('../../server/lib/swr_websocket');

module.exports = SwrRecoding;

function SwrRecoding(options){
	this.options = options || {};
    events.EventEmitter.call(this); // call super class constructor
	this.func = this.on;
	this.event = this.on;
	
	console.log( 'CALL SwrRecoding()' );

	// 외부 호출 전용 함수 	
	this.func('create', 	this.create.bind(this) );
	this.func('destroy', 	this.destroy.bind(this) );
	
}

util.inherits(SwrRecoding,events.EventEmitter);

//  레코딩 인스턴트
SwrRecoding.prototype.Instants = {};

//  레코딩 객체를 생성한다. 
SwrRecoding.prototype.create = function create(record) {
	var self = this;
	
	console.log( 'CALL SwrRecoding.prototype.create()' );
	console.log( record );
	
	var id = record.id;
	
	console.log( 'id = ', id );
	
	var instant = this.Instants[id] = {};
	
	instant.record	= record;
	instant.log 	= new SwrLog(record); 
	instant.ssh 	= new SwrSSH(); 
	instant.ws 		= new SwrWebSocket(id); 
	
	var log 	= instant.log;
	var ssh 	= instant.ssh;
	var ws  	= instant.ws;

	LinkEvent( ssh, "stdout", log, "stdout" );
	LinkEvent( ssh, "stdout", ws , "stdout" );
	LinkEvent( ws,  "stdin" , log, "stdin"  );
	LinkEvent( ws,  "stdin" , ssh, "stdin"  );
	
	log.emit( "open", id );

	return this;
}

// 레코딩 객체를 제거한다. 
SwrRecoding.prototype.destroy = function destroy(id) {

	var self = this;
	
	console.log( 'CALL SwrRecoding.prototype.destroy()' );
	console.log( id );
	
	var instant = this.Instants[id];
	
	var log 	= instant.log;
	var ssh 	= instant.ssh;
	var ws  	= instant.ws;
	
	ssh.emit( "disconnect" );
	ws.emit( "disconnect" );
	log.emit( "close" );
	
	this.Instants[id] = nil;
	
	return this;
}

// 웹소켓 접근 허가 검사 
SwrRecoding.prototype.IsAllowed = function IsAllowed(request,id){
	
	console.log( 'CALL SwrRecoding.prototype.IsAllowed()' );
	console.log( request.origin );
	console.log( request.resourceURL.pathname );
	console.log( 'id = ', id );
	// 생성되지 않은 id 에 웹 접속을 요구하면 거부 한다. 
	if( !this.Instants[id] ) {
		console.log( 'no found id = ', id );	
		return false;
	}
	// 접속을 허용한다. 
	console.log( 'websocket connet id = ', id );	
	return true;	
	
}

// 웹소켓 라우트를 마운트 한다. 
SwrRecoding.prototype.handlerWebSocket = function handlerWebSocket(request){
    console.log( 'CALL ws router default accept()' );
	var id = request.resourceURL.query.id;
	
	console.log( 'id = ', id );
	
	// 접근 허가 체크
	if (!this.IsAllowed(request,id)) {
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + '/' + request.resource + ' rejected.');
		return;
	}
	
	// 접근을 받아 준다. 
	var connection = request.accept(request.origin);
	var ws 		= this.Instants[id].ws;
	var shell  	= this.Instants[id].ssh;
	var record 	= this.Instants[id].record; 
	
	console.log((new Date()) + ' ssh-record-protocol connection accepted from ' + connection.remoteAddress +
		' - Protocol Version ' + connection.webSocketVersion);
	
	// 웹 소켓 접속 처리 및 쉘을 실행한다. 
	
	ws.emit( "connect", connection );
	shell.emit( "connect", record.host,
	                       record.port,
						   record.username,
						   record.password );
	
}

