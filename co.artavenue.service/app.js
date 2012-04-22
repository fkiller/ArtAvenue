var handle, req_handler, router, server;

  server = require("./server");
  router = require("./router");
  req_handler = require("./req_handler");

  handle = {};
  handle["/"] = req_handler.start;
  handle["/start"] = req_handler.start;
  handle["/upload"] = req_handler.upload;
  handle["/db"] = req_handler.db;
  handle["/fb"] = req_handler.fb;
  handle["/exhibition"] = req_handler.exhibition;
  handle["/activities"] = req_handler.activities;
  handle["/artwork/detail"] = req_handler.artbyid;

  server.start(router.route, handle);

