define(
[
	'app',
	'auth-services',
],
function (mainApp) { 
	'use strict';
	
	mainApp
	.controller('navbarCtrl', 
				[ '$scope','authServices','$state',  'Test',
	function ($scope, authServices, $state , Test) { 
	
		$scope.logout = function  () {
			authServices.logout();
		};
		
		$scope.List = function  () {
			$state.go( 'rec_list' );
		}
		
		$scope.New = function  () {
			$state.go( 'rec_new' );
		}
	
		$scope.Test = function  () {
			
//			console.log( 'call api' );
//			Test.test( { name : 'yyc', doc : 'frog' } ).$promise.then(function ( value,responseHeaders) {
//				console.log( value );
//				var data = value.data;
//				
//				if (typeof data== 'object') {
//					data = JSON.stringify(data, undefined, 2);
//					console.log( data );
//				}
//	
//			});
			
		};
		
	}]);

		
});
	