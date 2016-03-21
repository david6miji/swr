'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recRunCtrl
 * @description
 * # recRunCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recRunCtrl', 
[ '$scope', 'Record', '$state', '$stateParams',
function ($scope,Record, $state, $stateParams ) {
	
	console.log( 'CALL recRunCtrl' );
	
    $scope.alerts = [];
	
    $scope.closeAlert = function(index) {
		$scope.alerts = [];
    };  
	
    $scope.setAlert = function( msg ) {
		$scope.alerts = [{ type: 'danger', msg: msg }];
    };  
	
	$scope.setAlert( '알림' );
	
	$('[data-toggle="tooltip"]').tooltip()
	
	var RUN = new Runner();
	
    // 터미널을 준비한다. 	
	var elem = document.getElementById('term'); 
	var term = new Terminal({
      cols: 120,
      rows: 24,
      screenKeys: true
    });	
	
	
	// 처리 ID 를 얻는다. 
	var record_id = $stateParams.id;
	console.log( 'record_id = ', record_id );
	
	// 처리 레코드 정보 획득 
	$scope.record = Record.findOne( { filter: { where: { id: record_id } } },
	    function(record) { 
		    console.log( "CB Record.findOne() success"  );
			console.log( 'record = ', record );
			console.log( '$scope.record = ', $scope.record );
			  
			// 
			Record.fileRunSSHRecord( { id : record.id },
				function(data) { 
					console.log( "CB Record.fileRunSSHRecord() success"  );
					
					var run_content = data.data.content;
//					console.log( 'run_content = ', run_content );
					
					RUN.문자열을_기다림 = Runner.wait_prompt;
					RUN.명령을_입력함   = Runner.input_command;
					
					eval( run_content );
					
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
	
    term.open(elem);
	
    term.write('012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\r\n');
    term.write('02        1         2         3         4         5         6         7         8         9         10        11        \r\n');
	
	
}]);  

