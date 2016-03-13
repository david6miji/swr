var path = require('path');
var fs = require("fs");
var Client = require('ssh2').Client;
var app = require('../../server/server');

module.exports = function(Record) {

	var RecordInstant = {};
	var log_root = "/data/logs/";
	var log_ext  = ".log";

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
		
	}
	
    function log_close(id,record){
		var log = RecordInstant[id].writableStream;
		
		var logend = { logend : "end" };
		var textlogend =  '        ' 
		             + JSON.stringify(logend)
					 + '\n';
		
		log.write(textlogend);		
		
		log.write( '        ]'         + '\n' );
		log.write( "}\n" );
	}
	
    function log_write_stdout(id, data){
		
		var log = RecordInstant[id].writableStream;
		
		var stdout = { stdout : data.toString('utf8') };
		var textout =  '        ' 
		             + JSON.stringify(stdout)
					 + ','
					 + '\n';
		
		log.write(textout);		
	}
	
    function log_write_stdin(id, data){
		
		var log = RecordInstant[id].writableStream;
		
		var stdin = { stdin : data };
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
				console.log( 'RX : ', message );
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
						console.log('STDOUT: ' + data);
						
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
	
};

