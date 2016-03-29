var window = this
	, document = this.document;
	
function inherits(ctor, superCtor) {
	console.log( 'CALL inherits()');
	
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
}

function LinkEvent( src, src_event, target, target_event, transform ){

	src.on( src_event, function () {
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

define(
[
],
function () {

	'use strict';
	
	var EventEmitter = function() {
		this._events = this._events || {};
	}
	
	EventEmitter.prototype.addListener = function(type, listener) {
		this._events[type] = this._events[type] || [];
		this._events[type].push(listener);
	};
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.removeListener = function(type, listener) {
		if (!this._events[type]) return;
		
		var obj = this._events[type]
			, i = obj.length;
		
		while (i--) {
			if (obj[i] === listener || obj[i].listener === listener) {
			obj.splice(i, 1);
			return;
			}
		}
	};	
	
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	if (this._events[type]) delete this._events[type];
	};
	
	EventEmitter.prototype.once = function(type, listener) {
		function on() {
			var args = Array.prototype.slice.call(arguments);
			this.removeListener(type, on);
			return listener.apply(this, args);
		}
		on.listener = listener;
		return this.on(type, on);
	};
	
	EventEmitter.prototype.emit = function(type) {
		if (!this._events[type]) return;
		
		var args = Array.prototype.slice.call(arguments, 1)
			, obj = this._events[type]
			, l = obj.length
			, i = 0;
		
		for (; i < l; i++) {
			obj[i].apply(this, args);
		}
	};
	
	EventEmitter.prototype.listeners = function(type) {
		return this._events[type] = this._events[type] || [];
	};	

	return EventEmitter;
	
});

