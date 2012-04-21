var pg = require('pg'); 
//or native libpq bindings
//var pg = require('pg').native

var pw = process.env.ART_PG_PW

var conString = "postgres://avenue:" + pw + "@scrptr.com:9732/avenuedb";

//error handling omitted
pg.connect(conString, function(err, client) {
  client.query("SELECT NOW() as when", function(err, result) {
    console.log("Row count: %d",result.rows.length);  // 1
    console.log("Current year: %d", result.rows[0].when.getYear());
  });
});
