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

// Define headers
var headers = {
  // Default CORS Headers:
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
  // Custom headers
  // "Content-Type": "JSON"
  //"Content-Type": "plain/text"
};

// Define path to our Storage Unit
var storagePath = path.join(__dirname, 'storage', 'messages.json');

var sendOptionsSuccess = function (req, res) {
  console.log('opened connection stream');
  res.writeHead(200, headers);
  res.end();
};

var requestHandler = function(request, response) {
  try {
    //log the request on console
    console.log("Serving request type " + request.method + " for url " + request.url);
    if(request.method === "OPTIONS") {
      sendOptionsSuccess(request, response);
    } else {
    //Disptach
      dispatcher.dispatch(request, response);
    }
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

var append = function(path, theGreatAppendableObject) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    var savedMessages = JSON.parse(data);
    savedMessages.unshift(JSON.parse(theGreatAppendableObject));
    var toStore = JSON.stringify(savedMessages);

    fs.writeFile (path, toStore, function(err) {
        if (err) {
          throw err;
        }
        console.log('complete');
    });
  });
};

dispatcher.onPost("/classes/messages", function( req, res) {
  // console.log("request = ", req.body);
  append(storagePath, req.body);
  res.writeHead(201, headers);
  res.end('Successful stored Post Data');
});

dispatcher.onGet("/classes/messages", function( req, res) {
  // console.log("request = ", req);

  fs.readFile(storagePath, 'utf8', function (err, data) {
    if( err) {
      throw err;
    }
    var returnObj = {};
    returnObj['results'] = JSON.parse(data);

    console.log('Data to send: ' + returnObj);
    res.writeHead(200, headers);
    res.end(JSON.stringify(returnObj));
  });
});

exports.requestHandler = requestHandler;
