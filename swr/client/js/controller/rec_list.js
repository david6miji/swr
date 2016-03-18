'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recListCtrl
 * @description
 * # recListCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recListCtrl', 
[ '$scope', 'Record', '$state', 'ngTableParams',
function ($scope,Record, $state,  ngTableParams ) {
	
	console.log( 'CALL recListCtrl' );
//	$scope.records = [
//		{ id : 0, name : 'a', doc : 'b' },
//	];
	
	Record.find( {},
		function(records) { /* success */ 
   			console.log( "CB Record.find() success"  );
  			console.log( records );
			$scope.records = records;
			
			$scope.recordsTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: $scope.records, 
                getData: function ($defer, params) {
                    $scope.data = $scope.records.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve($scope.data);
                }
            });
				  
   	    },
        function(errorResponse) { /* error */ 
   			console.log( "CB Record.find() error"  );
  			console.log( errorResponse );
   		}
    );
	$scope.select = function( id ){
		console.log( "select" );
		console.log( "id =", id );
		console.log( { id : id } );
		$state.go( 'rec_edit', { id : Number(id) } );
	}
	
	$('#list_table').on('click', '.clickable-row', function(event) {
		console.log( "click" );
        // $(this).addClass('active').siblings().removeClass('active');
	});	
	
}]);  

