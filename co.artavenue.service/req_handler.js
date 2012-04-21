var exec = require("child_process").exec;
var querystring = require("querystring");
var freebase = require("freebase");
var pg = require("pg");

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
  response.end();
}

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

