/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {

  var path = require('path');
  var fs = require('fs');
  var storagePath = path.join(__dirname, 'storage', 'messages.json');


  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);



  var requestTypes = {}, statusCode;

  requestTypes.POST = function (url) {
    // The outgoing status.
    statusCode = 201;
    console.log("posting at", url);

  };

  requestTypes.GET = function (url) {
    // The outgoing status.
    statusCode = 200;
    console.log("getting at", url);
  };



  requestTypes[request.method](request.url);


  var data = {results:[]};
  var testResult = null;


  // data.results.push({
  //   username:'stridentbean',
  //   message: 'yo'
  // });


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


  append(storagePath,{a:1});



  // See the note below about CORS headers.

  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "JSON";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(data));
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
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
