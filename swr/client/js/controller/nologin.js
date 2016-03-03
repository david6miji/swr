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
	 
	
}]);  
