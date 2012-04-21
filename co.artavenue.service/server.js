var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var postData = '';
    var pathname = url.parse(request.url).pathname;
    var jreq = url.parse(request.url, true);
    
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" +
        postDataChunk + "'");
    });

    request.addListener("end", function() {
      route(handle, pathname, jreq, response, postData);
    });

  }

  http.createServer(onRequest).listen(3000);
  console.log("Server has started.");
}

exports.start = start;
