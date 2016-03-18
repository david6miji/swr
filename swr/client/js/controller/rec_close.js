'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recCloseCtrl
 * @description
 * # recCloseCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recCloseCtrl', 
[ '$scope', 'Record', '$state', '$stateParams',
function ($scope,Record, $state, $stateParams ) {
	
	console.log( 'CALL recCloseCtrl' );
	
	// 처리 ID 를 얻는다. 
	var record_id = $stateParams.id;
//	console.log( 'record_id = ', record_id );	

	var codeCellTemplate = '<div class="ui-grid-cell-contents text-center">{{row.entity[col.field]}}</div>';
	                            
    $scope.gridOptions = {
	  enableFullRowSelection: true,
	  enableRowSelection: true,	
	  multiSelect: false,
	  enableRowHeaderSelection: false,
      columnDefs: [
        {field: 'seq', displayName: '순서', width : 50, cellTemplate: codeCellTemplate },
        {field: 'time', displayName: '시간(msec)', width : 120 },
        {field: 'cmd', displayName: '명령', width : 60},
        {field: 'data', displayName: '내용'},
      ]    
    };
	
	// 처리 레코드 정보 획득 
	$scope.record = Record.findOne( { filter: { where: { id: record_id } } },
	    function(record) { 
		    console.log( "CB Record.findOne() success"  );
		    console.log( 'record = ', record );
		
			Record.fileLogSSHRecord( { id : record.id },
					function(data) { 
						console.log( "CB Record.fileLogSSHRecord() success"  );
						console.log( 'data = ', data.data.content );
						$scope.log = data.data.content;
						$scope.gridOptions.data = $scope.log.log;
						
					},
					function(err) { 
						console.log( "CB Record.fileLogSSHRecord() fail"  );
						console.log( 'err = ', err );
					}
			);
		
		 },
	    function(err) { 
		      console.log( "CB Record.findOne() fail"  );
			  console.log( 'err = ', err );
		 }	
	);
	
		
	$scope.convert = function(record){
		console.log( 'CALL $scope.convert' );
		console.log( 'record = ', record );
		 
		Record.convertLogSSHRecord( { id : record.id } )
		.$promise.then(function ( value,responseHeaders) {
			console.log( 'CB convertLogSSHRecord' );
			
			var data = value.data;
			
			if (typeof data== 'object') {
//			      	  data = JSON.stringify(data, undefined, 2);
//			      	  console.log( data );
				  console.log( data["ack"] );
				 if( data.ack == 'ok' ){
					 console.log( 'Nomal ack ok' );
				 }
			}	 
		});	 

  	};
	
	
	$scope.close = function(record){
		 console.log( 'CALL $scope.close' );
		 console.log( 'record = ', record );
		 
		 $state.go( 'rec_new' );
  	};

	$('[data-toggle="tooltip"]').tooltip()
	
}]);  

