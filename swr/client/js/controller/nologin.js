'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:nologinCtrl
 * @description
 * # nologinCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('nologinCtrl', 
[ '$scope', 'authServices',
function ($scope,authServices ) {
	
	console.log( 'CALL nologinCtrl' );
	
	$scope.login = function(user){
		 console.log( 'CALL $scope.login' );
		 console.log( 'user = ', user );
  	 	 authServices.login(user);
  	};
	
	$('[data-toggle="tooltip"]').tooltip()
	
	console.log( 'window.document.location.host = ', window.document.location.host );
//	var host = window.document.location.host.replace(/:.*/, '');
	var host = window.document.location.host;
	console.log( 'host = ', host );
	
	var elem = document.getElementById('pad');
    var cm = CodeMirror.fromTextArea(elem, {
        mode: "text/plain",
		lineNumbers: true,
		styleActiveLine: true,
    });
	
	console.log( 'ppad with = ', $('#ppad').width());
	
    cm.setSize($('#ppad').width(), 600);
	
//	var ws = new WebSocket('ws://' + host + '/nologin/doodle'  );
	var ws = new WebSocket('ws://' + host ,'doodle-protocol' );
	var sjs = new window.sharejs.Connection(ws);
	
	var doc = sjs.get('nologin_doodle', '대문글');
	
	doc.subscribe();
    doc.whenReady(function () {
      if (!doc.type) doc.create('text');
      if (doc.type && doc.type.name === 'text') {
        doc.attachCodeMirror(cm);
      }
    });
	
	 
	
}]);  
