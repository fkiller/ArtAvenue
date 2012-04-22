var geoh = require('./geohash.js');
var pg = require('pg');

var pw = process.env.ART_PG_PW;
var connString = "postgres://avenue:" + pw + "@artavenue.co:9732/avenuedb";

var client = new pg.Client(connString);
client.connect();

var query = client.query("SELECT latitude, longitude FROM");

var locations = [
  { latitude: 47.8559705, longitude: -181.9415665 },
  { latitude: 47.8558705, longitude: -181.9416665 },
  { latitude: 47.8557705, longitude: -181.9417665 },
  { latitude: 47.8556705, longitude: -181.9418665 },
  { latitude: 47.8555705, longitude: -181.9419665 }
];
 
var currentLocation = { latitude: 47.8557715, longitude: -181.9417665 };

currentLocation.geoHash = geoh.encodeGeoHash(currentLocation.latitude, currentLocation.longitude);
for (var i = 0; i < locations.length; i++) {
  locations[i].geoHash = geoh.encodeGeoHash(locations[i].latitude, locations[i].longitude);
}

function getNearest(currentLocation, locations, maxNeighbors) {
  var matching = {},
      accuracy = 12,
      matchCount = 0;
  while (matchCount < maxNeighbors && accuracy > 0) {
    var cmpHash = currentLocation.geoHash.substring(0,accuracy);
    for (var i = 0; i < locations.length; i++) {
      if (locations[i].geoHash in matching) continue; //don't re-check ones that have already matched
      if (locations[i].geoHash.substring(0,accuracy) === cmpHash) {
        matching[locations[i].geoHash] = locations[i];
        matchCount++;
        if (matchCount === maxNeighbors) break;
      }
    }
    accuracy--;
  }
  var tmp = [];
  for (var geoHash in matching) {
    tmp.push(matching[geoHash]);
  }
  return tmp;
}


var nearest = getNearest(currentLocation, locations, 2);

console.log(nearest);
