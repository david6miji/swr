'use strict';

/**
 * @ngdoc function
 * @name mainApp.controller:nologinCtrl
 * @description
 * # nologinCtrl
 * Controller of the mainApp
 */
var mainApp = angular.module('mainApp'); 
mainApp.controller('nologinCtrl', 
[ '$scope', 'authServices', 'Test',
function ($scope,authServices, Test ) {
	
	console.log( 'CALL nologinCtrl' );
	
	$scope.info = {
		host : "192.168.1.10",
		port : 22,
		username : "webconn",
		password : "",
	};
	
	$scope.connect = function(info){
		 console.log( 'CALL $scope.connect' );
		 console.log( 'info = ', info );
//  	 	 authServices.login(user);

        Test.connect( info ).$promise.then(function ( value,responseHeaders) {
			console.log( value );
			var data = value.data;
			
            if (typeof data== 'object') {
				  data = JSON.stringify(data, undefined, 2);
				  console.log( data );
				  term.write( data );
            }
				  
		});

  	};

	$('[data-toggle="tooltip"]').tooltip()
	
	var elem = document.getElementById('term'); 
	var term = new Terminal({
      cols: 80,
      rows: 24,
      screenKeys: true
    });
	
    term.open(elem);

//    term.write('\x1b[39mWelcome to term.js!\x1b[m\r\n');
//	term.write('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
//	term.write('일이삼사오일이삼사오일이삼사오일이삼\r\n');
//	term.write('안녕하십니까? 1234567890ABCD\r\n');

    term.write('0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\r\n');
    term.write('02        1         2         3         4         5         6         7         8         9         \r\n');
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
	
	var host = window.document.location.host;
	console.log( 'host = ', host );
	var ws = new WebSocket('ws://' + host ,'ssh2-protocol' );
	ws.isConnection = false;
	ws.onopen = function (event) {
		console.log( 'ws.onopen' );
		ws.isConnection = true;
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
        console.log( 'ws.message' );
		console.log( event.data );
		term.write(event.data);
//		ws.close(1000, 'good');
    };

	term.on('data', function(data) {
		console.log( 'key : ', data );
		if(ws.isConnection){
			ws.send( data);
		}
    });
	
}]);  

