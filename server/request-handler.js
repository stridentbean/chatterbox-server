/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// Import Path, FS, Dispatcher
var path = require('path');
var fs = require('fs');
var dispatcher = require('httpdispatcher');

// Define path to our Storage Unit
var storagePath = path.join(__dirname, 'storage', 'messages.json');

var requestHandler = function(request, response) {
  try {
    //log the request on console
    console.log("Serving request type " + request.method + " for url " + request.url);
    //Disptach
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var headers = {
  // Default CORS Headers:
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  // Custom headers
  "Content-Type": "JSON"
};

var append = function(path, theGreatAppendableObject) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    var savedMessages = JSON.parse(data);
    savedMessages.push(theGreatAppendableObject);
    var toStore = JSON.stringify(savedMessages);

    fs.writeFile (path, toStore, function(err) {
        if (err) {
          throw err;
        }
        console.log('complete');
    });
  });
};

dispatcher.onPost("/send", function( req, res) {
  console.log("request = ", req);
  append(storagePath, req);
  res.writeHead(201, headers);
  res.end('Successful stored Post Data');
});

dispatcher.onGet("/", function( req, res) {
  console.log("request = ", req);
  append(storagePath, req);
  res.writeHead(201, headers);
  res.end('Successful stored Post Data');
});

exports.requestHandler = requestHandler;
