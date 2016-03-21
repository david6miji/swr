var os = require('os');
var path = require('path');
var fs = require("fs");
var Client = require('ssh2').Client;
var app = require('../../server/server');
var SwrSSH = require('../../server/lib/swr_ssh');
var swr_convert = require('../../server/lib/swr_convert');

module.exports = function(Record) {

	var RecordInstant = {};
	var log_root = "/data/logs/";
	var log_ext  = ".log";
	
	var ssh = new SwrSSH();

	
    // 로그 디렉토리 체크 및 생성
	try{ fs.accessSync(log_root); }catch(e){ fs.mkdirSync(log_root); }
	
	// 웹 소켓 연결 권한 체크
	function urlIsAllowed(request,id) {
		console.log( 'CALL ws urlIsAllowed()' );
		console.log( request.origin );
		console.log( request.resourceURL.pathname );
		console.log( 'id = ', id );
		// 생성되지 않은 id 에 웹 접속을 요구하면 거부 한다. 
		if( !RecordInstant[id] ) {
			console.log( 'no found id = ', id );	
			return false;
		}
		// 접곡을 허용한다. 
		console.log( 'websocket connet id = ', id );	
        return true;
    }

	// 로그 헤드 기록 
    function log_open(id,record){
		// 파일 쓰기 스트림을 만든다 
		var log_filename = log_root 
		             + record.filename 
					 + log_ext;
		
		console.log( log_filename );
		RecordInstant[id].writableStream = fs.createWriteStream( log_filename );
		
		var log = RecordInstant[id].writableStream;
		log.write( '{'         + '\n' );
		
		var textobj =  '"info" :'  + JSON.stringify(record) + ',\n';
		log.write( textobj  );
		
		log.write( '"log" : ['         + '\n' );

		RecordInstant[id].stdout_remaining = '';
		RecordInstant[id].stdout_remaining_time = 0;
		RecordInstant[id].log_seq          = 0;

		var logstart = { seq : 0, time : Number(new Date()), cmd : "logstart", data : "start" };
		var textlogstart =  '        ' 
		             + JSON.stringify(logstart)
					 + ','
					 + '\n';
		
		log.write(textlogstart);		
		
	}
	
    function log_close(id,record){
		
		var log = RecordInstant[id].writableStream;
		
		log_write_stdout_remaining(id);
		
		var log_seq = RecordInstant[id].log_seq + 1;
		              RecordInstant[id].log_seq++;
					  
		var log_time = Number(new Date());
		
		var logend = { seq : log_seq, time : log_time, cmd : "logend", data : "end" };
		var textlogend =  '        ' 
		             + JSON.stringify(logend)
					 + '\n';
		
		log.write(textlogend);		
		
		log.write( '        ]'         + '\n' );
		log.write( "}\n" );
	}
	
    function log_write_stdout(id, data){
		
		var log = RecordInstant[id].writableStream;
		var str = data.toString('utf8');
		var remaining = RecordInstant[id].stdout_remaining;

		RecordInstant[id].stdout_remaining_time = Number(new Date());
		
		remaining += str;
		
		var index = remaining.indexOf('\n');
		var last  = 0;
		
		while (index > -1) {
			var line = remaining.substring(last, index+1);
			last = index + 1;

			var log_seq = RecordInstant[id].log_seq + 1;
		                  RecordInstant[id].log_seq++;
			var stdout_remaining_time = RecordInstant[id].stdout_remaining_time;
			
			var stdout = { seq : log_seq, time : stdout_remaining_time, cmd : "stdout", data : line };
			var textout =  '        ' 
						+ JSON.stringify(stdout)
						+ ','
						+ '\n';
			
			log.write(textout);		
			
			index = remaining.indexOf('\n', last);
		}

		remaining = remaining.substring(last);		
		RecordInstant[id].stdout_remaining = remaining;
		if( remaining === '' ){
			RecordInstant[id].stdout_remaining_time = 0;
		}	
		
//		var lines = str.split(os.EOL);
		
//		console.log( 'str = ', str );
		
//		var stdout = { stdout : data.toString('utf8') };
//		var textout =  '        ' 
//		             + JSON.stringify(stdout)
//					 + ','
//					 + '\n';
//		
//		log.write(textout);		
	}
	
    function log_write_stdout_remaining(id){
		
		var log = RecordInstant[id].writableStream;
	    var remaining = RecordInstant[id].stdout_remaining;
		
		if( remaining !== '' ){
			
//			console.log( 'remaining = ', remaining );	
			
			var log_seq = RecordInstant[id].log_seq + 1;
		                  RecordInstant[id].log_seq++;
			var stdout_remaining_time = RecordInstant[id].stdout_remaining_time;
			RecordInstant[id].stdout_remaining_time = 0;
						  
		    var stdout = { seq : log_seq, time : stdout_remaining_time, cmd : "stdout", data : remaining };
		    var textout =  '        ' 
		                 + JSON.stringify(stdout)
		    			 + ','
		    			 + '\n';
		    
		    log.write(textout);		
			
			RecordInstant[id].stdout_remaining = '';
		}	
		
	}
	
    function log_write_stdin(id, data){
		
		log_write_stdout_remaining(id);
			
		var log 	= RecordInstant[id].writableStream;
		var log_seq = RecordInstant[id].log_seq + 1;
		              RecordInstant[id].log_seq++;
		var log_time = Number(new Date());
		
		var stdin = { seq : log_seq, time : log_time, cmd : "stdin", data : data };
		
		var textin =  '        ' 
		             + JSON.stringify(stdin)
					 + ','
					 + '\n';
		
		log.write(textin);		
	}
	
	// 웹 소켓 연결을 사전에 설정해 놓는다. 
    function build_websocket_router(){
		// 웹 소켓 라우터 처리 전이라면 무시 
		if( !app.wss_router ) return;
		console.log( 'ok app.wss_router' );
		// 이미 SSHRecord 웹소켓이 마운트가 되어 있는 상태라면 무시 
		if( app.wss_router.IsBuildSSHRecord === true ) return;
		console.log( 'ok no app.wss_router' );
		// SSHRecord 웹소켓 마운트 처리 표시
		app.wss_router.IsBuildSSHRecord = true;
	    // 마운트 
	    app.wss_router.mount('/sshrecord/', 'ssh-record-protocol', function(request) {
	        console.log( 'CALL ws router default accept()' );
			var id = request.resourceURL.query.id;

            // 접근 허가 체크 - 현재는 무조건 통과  			
			if (!urlIsAllowed(request,id)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + '/' + request.resource + ' rejected.');
                return;
            }
			
			// 쉘과 연결 준비를 한다. 
			var SSHShell 	= RecordInstant[id].SSHShell;
			var record 		= RecordInstant[id].record;
			
			// 접근을 받아 준다. 
			var connection = request.accept(request.origin);
				console.log((new Date()) + ' ssh-record-protocol connection accepted from ' + connection.remoteAddress +
                ' - Protocol Version ' + connection.webSocketVersion);

			RecordInstant[id].connection = connection;
			
			// 웹 소켓 데이터 이벤트를 쉘에 연결한다. 
			connection.on('message', function(message) {
//				console.log( 'RX : ', message );
				if( message.utf8Data === '\r' ){
					log_write_stdin(id, '\n');
					RecordInstant[id].stream.write( '\n' );
				} else {
					log_write_stdin(id, message.utf8Data);
				    RecordInstant[id].stream.write( message.utf8Data );
				}					
			});
			
			connection.on('close', function(closeReason, description) {
				console.log( 'Close : ', closeReason, description );
			});
			
			connection.on('error', function(error) {
				console.log('Connection error for peer ' + connection.remoteAddress + ': ' + error);
			});
			
			// 쉘 연결 처리 
			
			SSHShell.on('error', function(err) {
				console.log( 'Event error' );
				console.log( 'err = ', err );
				// 에러 처리를 나중에 추가 한다. 
			});
			
			SSHShell.on('ready', function() {
			    console.log( 'Event ready ' );
				SSHShell.shell(function(err, stream) {
					if (err) {
					//	throw err;
					// 에러 처리를 한다. 
					}	
					
					RecordInstant[id].stream = stream;

					// 로그 파일을 연다. 
					log_open(id,record)

					// 쉘이 종료 되었을때의 처리 
					stream.on('close', function() {
						
						console.log('Stream : close');
						log_close(id,record);
						SSHShell.end();
					
					});
					
					// 쉘의 출력 처리 
					stream.on('data', function(data) {
//						console.log('STDOUT: ' + data);
						
						log_write_stdout(id, data);
						connection.sendUTF( data );
					});
					
					// 쉘 에러 처리 
					stream.stderr.on('data', function(data) {
						console.log('STDERR : ' + data);
					});
				
				});
			});
			
			// 쉘을 실행한다. 
			SSHShell.connect({
				host: record.host,
				port: record.port,
				username: record.username,
				password: record.password
			});

	    });
	}
	
    Record.createSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.createSSHRecord - data = ', data );
		
		// 웹 소켓 라우트를 빌드 한다.
		build_websocket_router();
		
		// id 에 해당하는 레코드 정보를 얻어 온다. 
		Record.findById(data.id, function(err,record) {
			console.log( "CB Record.findById"  );
			if( err ){
			    console.log( 'err = ', err );	
				var response = { ack : 'fail' };
				cb(null, response);
			} else {
			    console.log( record );	
				
				// 해당 인스턴스가 없다면 새로 생성한다.
				if( !RecordInstant[record.id] ) {
					console.log( 'new create RecordInstant id = ', record.id );	
					RecordInstant[record.id] = {};
				} 
				
				// 인스탄트에 쉘 클라이언트 인스턴스를 설정한다.
				RecordInstant[record.id].SSHShell = new Client();
				RecordInstant[record.id].record   = record;
				
				var response = { ack : 'ok' };
				cb(null, response);
			}
			
		});
		
    };
    Record.remoteMethod(
        'createSSHRecord',
        {
          http: {path: '/createSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	


    Record.closeSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.closeSSHRecord - data = ', data );
		
		// 쉘과 종료 처리를 한다 
		var id          = data.id;
		var SSHShell 	= RecordInstant[id].SSHShell;
		var record 		= RecordInstant[id].record;		
		var connection	= RecordInstant[id].connection;
		
//		console.log(  record     );
//		console.log(  SSHShell   );
//		console.log(  connection );
		
		SSHShell.end(); 
		connection.close(); 
		
		var response = { ack : 'ok' };
		cb(null, response);
		
    };
	
    Record.remoteMethod(
        'closeSSHRecord',
        {
          http: {path: '/closeSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	
    Record.fileLogSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.fileLogSSHRecord - data = ', data );
		var id          = data.id;

		// id 에 해당하는 레코드 정보를 얻어 온다. 
		Record.findById(data.id, function(err,record) {
			console.log( "CB Record.findById"  );
			if( err ){
			    console.log( 'err = ', err );	
				var response = { ack : 'fail' };
				cb(null, response);
				
			} else {
			    console.log( record );	
				
				// 로그 파일 이름을 얻는다. 
				var log_filename = log_root 
								 + record.filename 
								 + log_ext;
		
				var log_obj = JSON.parse( fs.readFileSync( log_filename, 'utf8'));	
				
				var response = { ack : 'ok', content : log_obj };
				cb(null, response);
			}

		});

    };
	
    Record.remoteMethod(
        'fileLogSSHRecord',
        {
          http: {path: '/fileLogSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );	
	
    Record.fileRunSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.fileRunSSHRecord - data = ', data );
		var id          = data.id;
		console.log( 'id = ', id );
		
		// 로그 파일 이름을 얻는다. 
		var log_filename = log_root 
						 + 'prg_test.js' ;
		
		var log_file = fs.readFileSync( log_filename, 'utf8');	
				
		var response = { ack : 'ok', content : log_file };
		cb(null, response);
		
    };
	
    Record.remoteMethod(
        'fileRunSSHRecord',
        {
          http: {path: '/fileRunSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	

    Record.convertLogSSHRecord = function( data, cb) {
    	console.log( 'Call method : Record.convertLogSSHRecord - data = ', data );
		
		// 쉘과 종료 처리를 한다 
		var id          = data.id;
		
		// id 에 해당하는 레코드 정보를 얻어 온다. 
		Record.findById(data.id, function(err,record) {
			console.log( "CB Record.findById"  );
			if( err ){
			    console.log( 'err = ', err );	
				var response = { ack : 'fail' };
				cb(null, response);
			} else {
			    console.log( record );	
				
				
				// 로그 파일 이름을 얻는다. 
				var log_filename = log_root 
								 + record.filename 
								 + log_ext;
		
				swr_convert( log_filename );
				
				var response = { ack : 'ok' };
				cb(null, response);
			}
			
		});
		
    };
	
    Record.remoteMethod(
        'convertLogSSHRecord',
        {
          http: {path: '/convertLogSSHRecord', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );

};

