/**
 * @ngdoc function
 * @name mainApp.controller:recRunCtrl
 * @description
 * # recRunCtrl
 * Controller of the mainApp
 */
define(
[
	'app',
	'runner',
	'termjs',
],
function (mainApp,Runner) {
	'use strict';
	
	mainApp.register
	.controller('recRunCtrl', 
	[ '$scope', 'Record', '$state', '$stateParams',
	function ($scope,Record, $state, $stateParams ) {
		
		console.log( 'CALL recRunCtrl2' );
		
		$scope.alerts = [];
		
		$scope.closeAlert = function(index) {
			$scope.alerts = [];
		};  
		
		$scope.setAlert = function( msg ) {
			$scope.alerts = [{ type: 'danger', msg: msg }];
		};  
		
		$scope.setAlert( '알림' );
		
//		$('[data-toggle="tooltip"]').tooltip()
		
		var RUN = new Runner();
		
		console.log( "RUN = ", RUN );
		
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
		
		// 레코드를 얻는다. 
		Record.findOne( { filter: { where: { id: record_id } } }).$promise
		.then(function ( record,responseHeaders) {
			console.log( "CB Record.findOne() success"  );
			console.log( 'record = ', record );
			$scope.record = record;
			console.log( '$scope.record = ', $scope.record );
			
			return Record.createSSHPlay( { id : $scope.record.id } ).$promise;
			
		})
		// 재생기가 서버에 생성되었다. 
		.then(function ( value,responseHeaders) {
			console.log( "CB Record.createSSHPlay() success"  );
			console.log( value );
			var data = value.data;
			console.log( data );
			
			return Record.fileRunSSHRecord( { id : $scope.record.id } ).$promise;
		})
		// 실행 스크립트를 얻었다. 
		.then(function ( value,responseHeaders) {
			console.log( "CB Record.fileRunSSHRecord() success"  );
			var data = value.data;
			console.log( data );
			var run_content = data.content;
			console.log( 'run_content = ', run_content );
			
			RUN.문자열을_기다림 = Runner.wait_prompt;
			RUN.명령을_입력함   = Runner.input_command;
			
			eval( run_content );
	
			var host = window.document.location.host;
			console.log( 'host = ', host );
			var ws = new WebSocket('ws://' + host + '/sshrecord/playing/?id=' + $scope.record.id,'ssh-record-protocol' );
		
			ws.isConnection = false;
			ws.onopen = function (event) {
				console.log( 'ws.onopen' );
				ws.isConnection = true;
			
	//			// 키보드와 웹 소켓과 연결한다.
	//			term.on('data', function(data) {
	////				console.log( 'key : ', data );
	//				if(ws.isConnection){
	//					ws.send(data);
	//				}
	//			});
			
			};
			
			ws.onerror = function (event) {
				console.log( 'ws.onerror' );
				ws.isConnection = false;
			};
			ws.onclose = function (event) {
				console.log( 'ws.onclose' );
				ws.isConnection = false;
			};
			
			ws.onmessage = function (event) {
				term.write( event.data );
				RUN.emit( 'stdout', event.data );
			};
			
		});
			
	
		term.open(elem);
		term.write( 'Play Start...\n');
		
		
	}]);  

});

