;(function() {

'use strict';

/**
 * Shared
 */

var window = this
  , document = this.document;

function Runner(options) {
  var self = this;

  if (!(this instanceof Runner)) {
    return new Runner(arguments[0], arguments[1], arguments[2]);
  }

}

Runner.wait_prompt = function( str ){
		console.log( '문자열을_기다림() 함수 호출 = ' , str );
}
	
Runner.input_command = function( str ){
		console.log( '명령을 입력함() 함수 호출 = ' , str );
}

/**
 * Expose
 */

if (typeof module !== 'undefined') {
  module.exports = Runner;
} else {
  this.Runner = Runner;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
