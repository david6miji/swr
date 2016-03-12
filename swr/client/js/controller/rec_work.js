'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:recWorkCtrl
 * @description
 * # recWorkCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('recWorkCtrl', 
[ '$scope', 'Record', '$state', '$stateParams',
function ($scope,Record, $state, $stateParams ) {
	
	console.log( 'CALL recWorkCtrl' );

    // 터미널을 준비한다. 	
	var elem = document.getElementById('term'); 
	var term = new Terminal({
      cols: 120,
      rows: 24,
      screenKeys: true
    });
	
	// 처리 ID 를 얻는다. 
	var record_id = $stateParams.id;
//	console.log( 'record_id = ', record_id );
	
	// 처리 레코드 정보 획득 
	$scope.record = Record.findOne( { filter: { where: { id: record_id } } },
	    function(record) { 
//		      console.log( "CB Record.findOne() success"  );
//			  console.log( 'record = ', record );
//			  console.log( '$scope.record = ', $scope.record );
	          // 레코드 세션 생성 요구
			  Record.createSSHRecord( { id : record.id } )
			  .$promise.then(function ( value,responseHeaders) {
			      console.log( value );
			      var data = value.data;
			
                  if (typeof data== 'object') {
//			      	  data = JSON.stringify(data, undefined, 2);
//			      	  console.log( data );
					  console.log( data["ack"] );
					  if( data.ack == 'ok' ){
					      // 웹 소켓 접속 요구 
                          var host = window.document.location.host;
						  console.log( 'host = ', host );
						  var ws = new WebSocket('ws://' + host + '/sshrecord/?id=' + record_id,'ssh-record-protocol' );
						  
	                      ws.isConnection = false;
	                      ws.onopen = function (event) {
								console.log( 'ws.onopen' );
								ws.isConnection = true;
							
								// 키보드와 웹 소켓과 연결한다.
								term.on('data', function(data) {
									console.log( 'key : ', data );
									if(ws.isConnection){
										ws.send(data);
									}
								});
							
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
//                            console.log( 'ws.message' );
//	                      	  console.log( event.data );
	                      	  term.write(event.data);
//	                      	ws.close(1000, 'good');
                          };

					  }
//			      	  term.write( data );
                  }
		      });
		 },
	    function(err) { 
		      console.log( "CB Record.findOne() fail"  );
			  console.log( 'err = ', err );
		 }
		 
	);
	
	$scope.end = function(info){
		 console.log( 'CALL $scope.end' );
		 console.log( 'info = ', info );
		 
		 $state.go( 'rec_close' );
  	};

	$('[data-toggle="tooltip"]').tooltip()
	
    term.open(elem);
	
		

    term.write('012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\r\n');
    term.write('02        1         2         3         4         5         6         7         8         9         10        11        \r\n');
    term.write('03CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('04CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('05CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('06CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('07CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('08CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('09CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('10CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('11CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('12CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('13CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('14CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('15CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('16CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('17CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('18CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('19CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('20CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('21CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('22CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
    term.write('23CDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
	
	
}]);  

