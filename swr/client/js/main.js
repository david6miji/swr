'use strict';

requirejs.config({
	baseUrl:'/js', // JavaScript 파일이 있는 기본 경로

	paths:{
		'jquery' 			:	"/lib/jquery/dist/jquery.min",
		'bootstrap' 		:	"/lib/bootstrap/dist/js/bootstrap.min",
		'angular'			:	"/lib/angular/angular",
		'angularAMD'		:	"/lib/angularAMD/angularAMD",
        'ngResource'		:	"/lib/angular-resource/angular-resource.min", 
		'angular-ui-router' : 	"/lib/angular-ui-router/release/angular-ui-router.min",
		'ng-table'			:	"/lib/ng-table/dist/ng-table.min",
		
		'termjs'			:	"/lib/termjs/term",
//		<script src="/lib/termjs/term.js"></script>

		
//		'angular-bootstrap'	:	"/lib/angular-bootstrap/ui-bootstrap-tpls.min",
//		<script src="/lib/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>

		'lbServices'		:	"/js/service/lb-services",
		'event'				: 	"/js/event",
		
		'auth-services'		:	"/js/service/auth-services",
		'navbar'			: 	"/js/controller/navbar",
		
		
		'runner'			: 	"/js/runner",

		
	},

	shim:{
		'bootstrap'			: ['jquery'],
		'angular'			: { exports: "angular", deps : ['jquery']},
		'angularAMD'		: ['angular'],
		'ngResource'		: ['angular'],
		'lbServices'		: ['angular','ngResource'],
		
		'angular-ui-router' : ['angular'],
		'ng-table'			: ['angular'],
	},
	
	deps: ['app', 'navbar']
	
});

