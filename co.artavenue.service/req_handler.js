var exec = require("child_process").exec;
var querystring = require("querystring");
var freebase = require("freebase");
var pg = require("pg");
var http = require("http");

var pw = process.env.ART_PG_PW;
var connString = "postgres://avenue:" + pw + "@artavenue.co:9732/avenuedb";

function start(request, response, postData) {
  console.log("Request handler 'start' was called.");

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write("Hello Start");
    response.end();
}

function db(request, response, postData) {
  console.log("Request handler 'db' was called.");
  console.log(request);

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
    freebase.query_freebase([{'artist': request.query.artist, 'name': null, 'art_subject':null, 'art_form':null,'art_genre':null,'media':null, 'type': '/visual_art/artwork'}], writeFreebase)
    //pullFreebase('', request.query.artist, '');
  }

  if(request.query.type == 'name') {
    console.log("type was name" + request.query.name);
    //pullFreebase(request.query.name, '', '');
    freebase.query_freebase([{'name': request.query.name, 'artist': null, 'art_subject':null,'art_genre':null, 'type': '/visual_art/artwork'}], writeFreebase)
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
        writeFreebase(postChunk);
        //writeFreebase(postChunk, '');
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

  function writeFreebase(sender) {
    response.writeHeader(200, {"Content-Type": "application/json"});
    /*var jres = {
      description: sender
    }
    if(type != '') {
      response.write(JSON.stringify(jres));
    } else {
      response.write(sender);
    }*/
    response.write(JSON.stringify(sender));
    response.end();
  }

}

function exhibition(request, response, postData) {
  if(request.query.latitude && request.query.longitude) {
   // freebase.query_freebase([{'/location/latitude': {'latitude<': Number(request.query.latitude) + 1, 'latitude>': Number(request.query.latitude) - 1}, 'name': null, 'type': '/location'}], writeFreebase)
  }
  var mSet = [];

  pg.connect(connString, function(err, client) {
    client.query("SELECT name FROM museum WHERE latitude > " + Number(request.query.latitude - 1).toString() + " AND latitude < " + Number(request.query.latitude + 1).toString, function(err, result) {
      console.log(Number(request.query.latitude - 1).toString());
      if(result) {
        console.log("Row count: %d",result.rows.length);  // 1
        console.log("Name: %s", result.rows[0].name);
        mSet.push(result.rows[0].name);
      } else {
        mSet.push("No results");
      }
      writeFreebase(mSet);
    });
  });

  function writeFreebase(sender) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(sender));
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
exports.exhibition = exhibition;
