'use strict';

/**
 * @ngdoc service
 * @name mainApp.authServices
 * @description
 * # mainApp
 * authServices in the mainApp.
 */
var mainApp = angular.module('mainApp');
mainApp.factory(
'authServices', ['Account', '$q', '$rootScope','$location', '$state', 
function( Account, $q, $rootScope, $location , $state ) {
	
    var self ={
		
    signup      : function(new_user){
                      Account.create(new_user).$promise.then(function (user) { 
						  $state.go( 'login' );
                      });
                  },
				  
	login       : function  (user){
                       Account.login( { rememberMe: true }, user).$promise.then(function(res) { 
						     $rootScope.currentUser=res.user;
							 $state.go( 'main' );
                         });
	              },
				  
  	logout      : function(){
  		           	    Account.logout().$promise.then(function(){
							 $rootScope.currentUser=null;
							 $state.go( 'before_login' );
  		           	    });
  		           },
				  
	}
	
	return self;
  
}]);
