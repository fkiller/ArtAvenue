var http = require('http');
var url = require('url');
var action;
var rendered = false;
var newdir = '';
var dl;
http.createServer(function(req, res){
  var request = url.parse(req.url, true);
  action = request.pathname;

  console.log(request);

  if (action.split('/').length == 4) { // URL = /{YOUTUBEID}/{TIMELINE}/{RESOLUTION}
    console.log('Hello World');
  } else { 
     res.writeHead(200, {'Content-Type': 'application/json' });
     res.end('Invalid request \n');
  }
}).listen(3000);
