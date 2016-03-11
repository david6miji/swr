'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recNewCtrl
 * @description
 * # recNewCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recNewCtrl', 
[ '$scope', 'Record', '$state', 
function ($scope,Record, $state ) {
	
	console.log( 'CALL recNewCtrl' );
	
    $scope.alerts = [];
	
    $scope.closeAlert = function(index) {
		$scope.alerts = [];
    };  
	
    $scope.setAlert = function( msg ) {
		$scope.alerts = [{ type: 'danger', msg: msg }];
    };  
	
	
	$scope.record = {
		name 	    : "default",
		host 		: "192.168.1.10",
		port 		: 22,
		username 	: "webconn",
		password 	: "",
	};
	
	$scope.connect = function(record){
//		 console.log( 'CALL $scope.connect' );
//		 console.log( 'record = ', record );
		 
		 Record.findOne( { filter: { where: { name : record.name } } } , 
  		     function(recordResult) { /* success */ 
//   			      console.log( "CB Record.findOne() success"  );
//  				  console.log( recordResult );
//  				  console.log( $scope.record );
				  
				  recordResult.host     = $scope.record.host;
				  recordResult.port     = $scope.record.port;
				  recordResult.username = $scope.record.username;
				  recordResult.password = $scope.record.password;
				  recordResult.$save();
				  
				  $state.go( 'rec_work', { id : recordResult.id } );
   	         },
             function(errorResponse) { /* error */ 
//   			      console.log( "CB Record.findOne() error"  );
//  				  console.log( errorResponse );
				  if( errorResponse.status == 404 ){ // status: 404, statusText: "Not Found"
        		      Record.create( record,
        		          function(recordResult) { /* success */ 
//        		     	      console.log( "CB Record.create() success"  );
//        		     		  console.log( recordResult );
        		              $state.go( 'rec_work', { id : recordResult.id } );
        	              },
                          function(errorResponse) { /* error */ 
//        		     	       console.log( "CB Record.create() error"  );
//        		     		   console.log( errorResponse );
							   $scope.setAlert( '['+ errorResponse.status + '] ' + errorResponse.statusText);
        		          }
        		      );
				  }
   		     }
         );

  	};

	$('[data-toggle="tooltip"]').tooltip()
	
}]);  

