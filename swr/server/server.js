var loopback = require('loopback');
var boot = require('loopback-boot');
var livedb = require('livedb');
// var sharejs = require('share');

var SR = require('../server/lib/swr_recording');
var SwrRecording = new SR();

var app = module.exports = loopback();

// var backend = livedb.client(livedb.memory());
// var share = require('share').server.createClient({backend: backend});

// console.log( __dirname );
// console.log( sharejs.scriptsDir );

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    server = app.start();
	
//	app.use( loopback.static(sharejs.scriptsDir) );

//   var Duplex = require('stream').Duplex;
   var WebSocket       = require('websocket').server;
   var WebSocketRouter = require('websocket').router;
   
   wss = new WebSocket({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });
	
	app.wss_router = new WebSocketRouter();
    app.wss_router.attachServer(wss);
	app.wss_router.mount('/sshrecord/recording/', 'ssh-record-protocol', function(request) {
		SwrRecording.handlerWebSocket( request );
	});
	
/*		
	function urlIsAllowed(request) {
		console.log( 'CALL ws urlIsAllowed()' );
		console.log( request.origin );
		console.log( request.resource );
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

	wss.on('request', function(request) {
		console.log( 'EVENT request' );
		console.log( request );
		if (!urlIsAllowed(request)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + '/' + request.resource + ' rejected.');
            return;
        }
		
		console.log( 'app.connection = ', app.connection );
//		var connection = request.accept('ssh2-protocol', request.origin);
		app.connection = request.accept('ssh-record-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
		
		console.log('connection.connected = ', app.connection.connected );
		
//		var stream = new Duplex({objectMode: true});
		
		
//        stream._read = function() {};
//        stream._write = function(chunk, encoding, callback) {
////			console.log( 's->c', chunk );
//            if (connection.connected ) {
//                connection.sendUTF(JSON.stringify(chunk));
//            }
//            callback();
//        };
//		
//        stream.on( 'error', function (msg) {
//			connection.close(WS.CLOSE_REASON_PROTOCOL_ERROR);
//		});	
//            
//        stream.on( 'end', function (msg) {
//			connection.close(WS.CLOSE_REASON_NORMAL);
//		});	

//		app.connection.on('message', function (message) {
////		    console.log( 'c->s message : ', message );
////            stream.push( JSON.parse(message.utf8Data) );
//        });
		
		app.connection.on('close', function (reasonCode, description) {
//		    console.log( 'c->s ', reasonCode, description );
//            stream.push( null );
//			stream.emit('close');
            console.log( 'client went away' );
            connection.close( reasonCode );
        });
		
//        share.listen( stream );
		
		console.log( 'wss.connections.length = ', wss.connections.length );
		
	});
*/
	
} 	

});
