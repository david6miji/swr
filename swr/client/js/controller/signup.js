'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:authCtrl
 * @description
 * # authCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('signupCtrl', [ '$scope', 'authServices', function ($scope, authServices) {

  	 $scope.RegisterFields = [
      {
        key: 'firstName',
        type: 'input',
        templateOptions: {
          required: true,
          label: '이름',
        }
      },{
        key: 'lastName',
        type: 'input',
        templateOptions: {
          required: true,
          label: '성',
        }
      },{
        key: 'email',
        type: 'input',
        templateOptions: {
          required: true,
          label: '이메일',
        }
      },{
        key: 'password',
        type: 'input',
        templateOptions: {
          type:"password",	
          required: true,
          label: '암호',
        }
      }];
	  
     $scope.signup = function(newUser){
         authServices.signup(newUser);
     };

}]);  
  