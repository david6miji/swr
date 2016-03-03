(function(){
'use strict';

var mainApp = angular.module('mainApp'); 
mainApp.controller('navbarCtrl', [ '$scope', 'authServices', 'Test',  function ($scope, authServices , Test ) {

 	$scope.logout = function  () {
 		authServices.logout();
 	};

 	$scope.Test = function  () {
		
		console.log( 'call api' );
		Test.test( { name : 'yyc', doc : 'frog' } ).$promise.then(function ( value,responseHeaders) {
			console.log( value );
			var data = value.data;
			
            if (typeof data== 'object') {
				  data = JSON.stringify(data, undefined, 2);
				  console.log( data );
            }
				  
		});
 		
 	};
	
}]);
	
})();
