var loopback = require('loopback');
var boot = require('loopback-boot');
var livedb = require('livedb');
var sharejs = require('share');

var app = module.exports = loopback();

var backend = livedb.client(livedb.memory());
var share = require('share').server.createClient({backend: backend});

console.log( __dirname );
console.log( sharejs.scriptsDir );

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
	
	app.use( loopback.static(sharejs.scriptsDir) );

   var Duplex = require('stream').Duplex;
   var WS = require('websocket').server;
   var verifyClientFunc = function( info ) {
	   console.log( 'CALL verifyClientFunc()' );
	   console.log( info.req.url );
	   return true;
   }
   
   wss = new WS({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });
	
	function originIsAllowed(origin) {
		console.log( 'CALL ws originIsAllowed()' );
		console.log( origin );
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }
	
	wss.on('request', function(request) {
		console.log( 'EVENT request' );
//		console.log( request );
		if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
		
		var connection = request.accept('doodle-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
		
		console.log('connection.connected = ', connection.connected );
		
		var stream = new Duplex({objectMode: true});
		
        stream._read = function() {};
        stream._write = function(chunk, encoding, callback) {
//			console.log( 's->c', chunk );
            if (connection.connected ) {
                connection.sendUTF(JSON.stringify(chunk));
            }
            callback();
        };
		
        stream.on( 'error', function (msg) {
			connection.close(WS.CLOSE_REASON_PROTOCOL_ERROR);
		});	
            
        stream.on( 'end', function (msg) {
			connection.close(WS.CLOSE_REASON_NORMAL);
		});	

		connection.on('message', function (message) {
//		    console.log( 'c->s message : ', message );
            stream.push( JSON.parse(message.utf8Data) );
        });
		
		connection.on('close', function (reasonCode, description) {
//		    console.log( 'c->s ', reasonCode, description );
            stream.push( null );
			stream.emit('close');
            console.log( 'client went away' );
            connection.close( reasonCode );
        });
		
        share.listen( stream );
		
		console.log( 'wss.connections.length = ', wss.connections.length );
		
	});
	
} 	

});
