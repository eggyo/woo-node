// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var ParseDashboard = require('parse-dashboard');
var allowInsecureHTTP = true;
var request = require('request');
var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
  url: 'http://klangsang-led.com',
  wpAPI: true,
  version: 'wc/v1',
  consumerKey: 'ck_e95a3d1d2224538dfe42ac8fd84b48a408f5d2d1',
  consumerSecret: 'cs_366e3a3766c2b7e389b0085ce87a2dc369448d11'
});
var dashboard = new ParseDashboard({
  "apps": [{
    "serverURL": "http://woo-node.herokuapp.com/parse",
    "appId": "myAppId",
    "masterKey": "myMasterKey",
    "appName": "woo-node"
  }],
  "users": [{
    "user": "admin",
    "pass": "pass"
  }]
}, allowInsecureHTTP);

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  restAPIKey: process.env.REST_KEY,
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  push: {
    ios: [{
      pfx: './pushCertificates.dev.p12', // Dev PFX or P12
      bundleId: 'Eggyo.woo-client',
      production: false // Dev
    }, {
      pfx: './pushCertificates.dis.p12', // Prod PFX or P12
      bundleId: 'Eggyo.woo-client',
      production: true // Prod
    }]
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});
app.post('/createdOrderCallback', function(request, response) {
  WooCommerce.get('webhooks', function(err, data, res) {
    console.log(res);
  });

  callLineNof(function(response) {

  });
  Parse.Cloud.run('createdOrderNofPub', {}).then(function(obj) {
    response.send(obj);
    console.log(obj); // your JSON
    // echo the result back
  });
});
// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(request, response) {

});

function callLineNof(responseMsg) {
  console.log("callLineNof");
  var options = {
    url: 'https://notify-api.line.me/api/notify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': 'myAppId',
      'X-Parse-REST-API-Key': 'myRestKey'
    },
    body: {
      'message': 'มีลูกค้าสั่งของ'
    }
  };

  function callback(error, response, body) {
    console.log("response:" + JSON.stringify(response));
    if (!error && response.statusCode == 200) {
      responseMsg("ok");
      console.log("result:ok ");
    } else {
      console.error("Unable to send message. Error :" + error);
    }
  }
  request(options, callback);
}




var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
