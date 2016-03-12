var Client = require('ssh2').Client;

module.exports = function(app) {
	
    var ds = app.loopback.createDataSource('memory');
  
    var Test = ds.createModel('Test');
	
    Test.test = function( data, cb) {
    	console.log( 'Call Test.test remote method - data = ', data );

   	    response = { ack : 'ok' };
   	    cb(null, response);
		
    };
    
    Test.remoteMethod(
        'test',
        {
          http: {path: '/test', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );

    Test.connect = function(info, cb) {
    	console.log( 'Call Test.connect remote method - data = ', info );
		
		var conn = new Client();
		
		conn.on('ready', function() {
			console.log( 'Event ready ' );
			console.log( 'app.connection = ', app.connection );
			
            conn.shell(function(err, stream) {
				
                if (err) throw err;
                stream.on('close', function() {
					
                      console.log('Stream :: close');
                      conn.end();
				  
                });
				
				stream.on('data', function(data) {
					
                    console.log('STDOUT: ' + data);
					if (app.connection.connected ) {
							app.connection.sendUTF( data );
					}
				  
                });
				
				stream.stderr.on('data', function(data) {
                      console.log('STDERR: ' + data);
                });
				
			    app.connection.on('message', function (message) {
					console.log('STDIN: ' + message.utf8Data);
					console.log(message);
					if( message.utf8Data === '\r' ){
//						stream.push( '\n' );
						stream.write( '\n' );
					} else {
//				        stream.push( message.utf8Data );
				        stream.write( message.utf8Data );
					}	
				});

//                stream.end('ls -l\nexit\n');
				
            });	

		});

		conn.connect({
			host: info.host,
			port: info.port,
			username: info.username,
			password: info.password
		});

   	    response = { ack : 'ok' };
   	    cb(null, response);
		
    };
    
    Test.remoteMethod(
        'connect',
        {
          http: {path: '/connect', verb: 'post'},
          accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
          returns: {arg: 'data', type: 'object' }
        }
    );
	
    app.model(Test);
	
};
