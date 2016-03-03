'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:mainCtrl
 * @description
 * # mainCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('mainCtrl', 
[ '$rootScope', '$scope', '$state', '$timeout',
function ($rootScope, $scope,$state,$timeout,$uibModal ) {
	
	console.log( 'CALL mainCtrl' );
//	var host = window.document.location.host.replace(/:.*/, '');
//	console.log( 'host = ', host );
//	
//	var elem = document.getElementById('pad');
//    var cm = CodeMirror.fromTextArea(elem, {
//        mode: "text/plain"
//    });
//
//	var ws = new WebSocket('ws://' + host + ':8988' + '/hello1/' + $rootScope.currentUser.id + '?name=ppp');
//	var sjs = new window.sharejs.Connection(ws);
//	var doc = sjs.get('users', 'frog');
//	
//	doc.subscribe();
//    doc.whenReady(function () {
//      if (!doc.type) doc.create('text');
//      if (doc.type && doc.type.name === 'text') {
//        doc.attachCodeMirror(cm);
//      }
//    });
	
}]);  


