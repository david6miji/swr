'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recCloseCtrl
 * @description
 * # recCloseCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recCloseCtrl', 
[ '$scope', 'Test', '$state', 
function ($scope,Test, $state ) {
	
	console.log( 'CALL recCloseCtrl' );
	
	$scope.closerec = {
		doc_name 	: "default",
		host 		: "192.168.1.10",
		port 		: 22,
		username 	: "webconn",
		password 	: "",
	};
	
	$scope.close = function(info){
		 console.log( 'CALL $scope.close' );
		 console.log( 'info = ', info );
		 
		 $state.go( 'rec_new' );
  	};

	$('[data-toggle="tooltip"]').tooltip()
	
}]);  

