var exec = require("child_process").exec;
var querystring = require("querystring");
var freebase = require("freebase");
var pg = require("pg");
var http = require("http");

function start(request, response, postData) {
  console.log("Request handler 'start' was called.");

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write("Hello Start");
    response.end();
}

function db(request, response, postData) {
  console.log("Request handler 'db' was called.");
  console.log(request);

  var pw = process.env.ART_PG_PW

  var conString = "postgres://avenue:" + pw + "@scrptr.com:9732/avenuedb";

  //error handling omitted
  pg.connect(conString, function(err, client) {
    client.query("SELECT NOW() as when", function(err, result) {
      console.log("Row count: %d",result.rows.length);  // 1
      console.log("Current year: %d", result.rows[0].when.getYear());
    });
  });



  response.writeHeader(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify(request.query));
  //freebase.get_description("Leonardo da Vinci", writeFreebase, [{"type": "/visual_art/artwork"}])
  response.end();
  /*function writeFreebase(sender) {
    response.writeHeader(200, {"Content-Type": "application/json"});
    var jres = {
      description: sender
    }
    response.write(JSON.stringify(jres));
    response.end();
  }*/
}

function fb(request, response, postData) {

  if(request.query.type == 'description') {
    console.log("type was description");
    freebase.get_description(request.query.description, writeFreebase, [{"type": "/visual_art/artwork"}])
  }

  if(request.query.type == 'artist') {
    console.log("type was artist");
    pullFreebase('', request.query.artist, '');
  }

  if(request.query.type == 'name') {
    console.log("type was name" + request.query.name);
    pullFreebase(request.query.name, '', '');
  }

  function pullFreebase(name, artist, description) {
    if(!name) 
      name = null
    if(!artist)
      artist = null
    if(!description)
      description = null

    var json = {"query": 
    [{ 
        "id":null, 
        "type":"/visual_art/artwork", 
        "name":name, 
        "artist":artist, 
        "art_subject":null, 
        "art_form":null, 
        "art_genre":null, 
        "dimensions_meters":null, 
        "locations":null, 
        "owners":null, 
        "editions":null, 
        "edition_of":null, 
        "belongs_to_series":null 
    }] 
    }

    var address= {
      host: 'api.freebase.com',
      port: 80,
      path: '/api/service/mqlread?query=' + encodeURI(JSON.stringify(json)),
      method: 'GET'
    }

    var req = http.request(address, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      var postChunk = '';
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        postChunk += chunk;
      });
      res.on('end', function(e) {
        writeFreebase(postChunk, '');
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();

  }

  function writeFreebase(sender, type) {
    response.writeHeader(200, {"Content-Type": "application/json"});
    var jres = {
      description: sender
    }
    if(type != '') {
      response.write(JSON.stringify(jres));
    } else {
      response.write(sender);
    }
    response.end();
  }

}
 
//}

function upload(request, response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  console.log(querystring.parse(postData))
  response.write(querystring.parse(postData));
  response.end();
}

exports.start = start;
exports.upload = upload;
exports.db = db;
exports.fb = fb;
