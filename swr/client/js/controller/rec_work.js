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
[ '$scope', 'Test', '$state', 
function ($scope,Test, $state ) {
	
	console.log( 'CALL recWorkCtrl' );
	
	$scope.workrec = {
		doc_name 	: "default",
		host 		: "192.168.1.10",
		port 		: 22,
		username 	: "webconn",
		password 	: "",
	};
	
	$scope.end = function(info){
		 console.log( 'CALL $scope.end' );
		 console.log( 'info = ', info );
		 
		 $state.go( 'rec_close' );
  	};

	$('[data-toggle="tooltip"]').tooltip()
	
	var elem = document.getElementById('term'); 
	var term = new Terminal({
      cols: 120,
      rows: 24,
      screenKeys: true
    });
	
    term.open(elem);

//    term.write('\x1b[39mWelcome to term.js!\x1b[m\r\n');
//	term.write('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\r\n');
//	term.write('일이삼사오일이삼사오일이삼사오일이삼\r\n');
//	term.write('안녕하십니까? 1234567890ABCD\r\n');

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

