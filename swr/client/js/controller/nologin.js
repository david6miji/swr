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
[ '$scope', 'authServices', 'Test',
function ($scope,authServices, Test ) {
	
	console.log( 'CALL nologinCtrl' );
	
	$scope.info = {
		host : "192.168.1.10",
		port : 22,
		username : "webconn",
		password : "",
	};
	
	$scope.connect = function(info){
		 console.log( 'CALL $scope.connect' );
		 console.log( 'info = ', info );
//  	 	 authServices.login(user);

        Test.connect( info ).$promise.then(function ( value,responseHeaders) {
			console.log( value );
			var data = value.data;
			
            if (typeof data== 'object') {
				  data = JSON.stringify(data, undefined, 2);
				  console.log( data );
            }
				  
		});

  	};

	$('[data-toggle="tooltip"]').tooltip()
	 
	
}]);  
