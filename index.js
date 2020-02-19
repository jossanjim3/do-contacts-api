'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path');

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({
  strict: false
}));
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

var logger = require('./logger');

oasTools.configure(options_object);

// Initialize database before running the app
var db = require('./db');
db.connect(function (err, _db) {
  logger.info('Initializing DB...');
  if(err) {
    logger.error('Error connecting to DB!', err);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
    //return 1;
  } else {
    db.find({}, function (err, contacts) {
      if(err) {
        logger.error('Error while getting initial data from DB!', err);
      } else {
        if (contacts.length === 0) {
          logger.info('Empty DB, loading initial data...');
          db.init();
      } else {
          logger.info('DB already has ' + contacts.length + ' contacts.');
      }
      }
    });
  }
});

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    logger.info("App running at http://localhost:" + serverPort);
    logger.info("________________________________________________________________");
    if (options_object.docs !== false) {
      logger.info('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      logger.info("________________________________________________________________");
    }
  });
});

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});
