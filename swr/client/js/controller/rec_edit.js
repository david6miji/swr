'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recEditCtrl
 * @description
 * # recEditCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recEditCtrl', 
[ '$scope', 'Record', '$state', '$stateParams',
function ($scope,Record, $state, $stateParams ) {
	
	console.log( 'CALL recEditCtrl' );
	
    $scope.alerts = [];
	
    $scope.closeAlert = function(index) {
		$scope.alerts = [];
    };  
	
    $scope.setAlert = function( msg ) {
		$scope.alerts = [{ type: 'danger', msg: msg }];
    };  
	
	$scope.setAlert( '알림' );
	
	$('[data-toggle="tooltip"]').tooltip()

	// 처리 ID 를 얻는다. 
	var record_id = $stateParams.id;
	console.log( 'record_id = ', record_id );
	
	// 처리 레코드 정보 획득 
	$scope.record = Record.findOne( { filter: { where: { id: record_id } } },
	    function(record) { 
		      console.log( "CB Record.findOne() success"  );
			  console.log( 'record = ', record );
			  console.log( '$scope.record = ', $scope.record );

		 },
	    function(err) { 
		      console.log( "CB Record.findOne() fail"  );
			  console.log( 'err = ', err );
		 }
		 
	);

	$scope.modify = function(record){
		
		$scope.record = record;
		$scope.record.$save().then(function(result) { 
			console.log('saved'); 
			$scope.setAlert( '수정되었습니다.' );
		}, function(err) {
			console.log(err); 
			$scope.setAlert( '수정에 실패했습니다.' );
		});
		
	};
		
	$scope.delete = function(record){
		
		Record.deleteById({ id: record.id }).$promise.then(function() { 
			console.log('delete');
			$state.go( 'rec_list' );
			
		}, function(err) {
			console.log(err); 
			$scope.setAlert( '삭제에 실패했습니다.' );
		});
		
	};
	
}]);  

