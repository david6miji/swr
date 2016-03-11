(function(){
'use strict';
var mainApp = angular.module('mainApp',
[
   'ui.router',
   'lbServices',
   'formly', 
   'formlyBootstrap',
   'ui.bootstrap',
]);

var BasePage = 'rec_new'; // 'before_login';
	
mainApp.config([ '$stateProvider','$urlRouterProvider', '$httpProvider',
function($stateProvider,$urlRouterProvider,$httpProvider) {

  $stateProvider
    .state('rec_new', {
		url        : '/rec_new',
		templateUrl: 'view/rec_new.html',
		controller : 'recNewCtrl',
		skipLogin : true
    })
    .state('rec_work', {
		url        : '/rec_work/:id',
		templateUrl: 'view/rec_work.html',
		controller : 'recWorkCtrl',
		skipLogin : true
    })
    .state('rec_close', {
		url        : '/rec_close',
		templateUrl: 'view/rec_close.html',
		controller : 'recCloseCtrl',
		skipLogin : true
    })
    .state('before_login', {
		url        : '/before_login',
		templateUrl: 'view/before_login.html',
		controller : 'nologinCtrl',
		skipLogin : true
    })
    .state('signup', {
		url: '/signup',
		templateUrl: 'view/signup.html',
		controller : 'signupCtrl',
		skipLogin : true
    })
    .state('login', {
		url: '/login',
		templateUrl: 'view/login.html',
		controller : 'loginCtrl',
		skipLogin : true
    })
    .state('main', {
		url: '/main',  
	    views:{
			''                  : { templateUrl: 'view/main.html'         , controller: 'mainCtrl'         },
	    },
		skipLogin : false
    })
    ;

	$urlRouterProvider.otherwise( BasePage ); 
	
    $httpProvider.interceptors.push(function($q, $location, LoopBackAuth,$rootScope) {
        return {
            responseError: function(rejection) {
                 if (rejection.status === 401) {
                     LoopBackAuth.clearUser();
                     LoopBackAuth.clearStorage();
					 $rootScope.$state.go( BasePage );
                 }
                 return $q.reject(rejection);
            }
        };
    });
	
	
}]);


mainApp.run( ['$rootScope', '$state', 'Account', function($rootScope, $state, Account ){

	if( Account.isAuthenticated() ){
		Account.getCurrent( function( user ){
//			console.log( 'Callback Account.getCurrent()' );
			$rootScope.currentUser = Account.getCachedCurrent();
//			console.log( '  $rootScope.currentUser ', $rootScope.currentUser );
			$state.go(localStorage['LastState']);
			
		});
	}
	
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//        console.log( 'Event $stateChangeStart' );
//		console.log( '  toState = ', toState );
//		console.log( '  $rootScope.currentUser ', $rootScope.currentUser );
		 
		if( !$rootScope.currentUser && !toState.skipLogin ){
			$state.go(BasePage); 
            event.preventDefault();
		}
    });
	
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		localStorage['LastState'] = toState.name;
	});	
	
}]);

})();
