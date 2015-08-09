/* globals process, require, module, __dirname, console */
'use strict';

var express     = require('express'),
    https       = require('https'),
    lessmw      = require('less-middleware'),
    path        = require('path'),
    httpProxy   = require('http-proxy'),
    helmet      = require('helmet'),
    fs          = require('fs'),
    hamlc       = require('haml-coffee');

var app = module.exports = express();

/*****************
 * Security Suite
 * https://github.com/helmetjs/helmet
 *****************/

var cspSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  'cdn.mxpnl.com',
  'cdn.ravenjs.com',
  'd2dq2ahtl5zl1z.cloudfront.net',
  'http://js.stripe.com', 'https://js.stripe.com',
  'http://api.stripe.com', 'https://api.stripe.com',
  'http://js.intercomcdn.com', 'https://js.intercomcdn.com',
  'http://assets.customer.io', 'https://assets.customer.io',
  'http://widget.intercom.io', 'https://widget.intercom.io',
  'http://static.intercomcdn.com', 'https://static.intercomcdn.com',
  'http://*.cloudfront.net/releases/current/tracker.js',
  'https://*.cloudfront.net/releases/current/tracker.js',
  'http://cdn.segment.com', 'https://cdn.segment.com',
  'http://*.google-analytics.com', 'https://*.google-analytics.com',
  'http://*.googleapis.com', 'https://*.googleapis.com',
  'http://*.gstatic.com', 'https://*.gstatic.com',
];

if (app.get('env') === 'development') {
  cspSrc.push('http://localhost:35728/livereload.js');
  cspSrc.push('https://localhost:35728/livereload.js');
}

app.use(helmet.xssFilter());
app.use(helmet.frameguard());  // Same-origin by default.
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60 * 1000 }));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.crossdomain());
app.use(helmet.csp({
  allow: ["'*'"],  // needed for Firefox <=22. See:https://github.com/evilpacket/helmet/pull/16
  options: ['inline-script', 'eval-script'], // also needed for Firefox <=22
  scriptSrc: cspSrc,
  fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
  styleSrc: ["'self'", 'code.angularjs.org', 'fonts.googleapis.com', "'unsafe-inline'"],
  setAllHeaders: false,
  safari5: false
}));


/*****************
 * Proxy and Redirects
 *****************/

function buildProxyData(envHostname, envPort, envHttps) {
  var res = {};
  res.prefix = envHttps ? 'https://' : 'http://';
  res.host = envHostname || 'localhost';
  res.port = envHttps ? 443 : envPort || '5000';
  res.url = res.prefix + res.host + ':' + res.port;
  return res;
}
var proxyData = buildProxyData(process.env.PROXY_HOSTNAME, process.env.PORT, process.env.HTTPS);
var proxy = httpProxy.createProxyServer({target:  proxyData.url});

// 301 Redirects for alternative server name and HTTPS
var redirectToUri = process.env.REDIRECT_TO_URI;
if (process.env.REQUIRE_SSL || app.get('env') === 'production' || app.get('env') === 'staging') {
  app.use(function(req, res, next){
    if (redirectToUri && req.host !== redirectToUri) {
      return res.redirect(301, 'https://' + redirectToUri + req.url);
    } else if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.host + req.url);
    } else {
      return next(); /* Continue to other routes if we're not redirecting */
    }
  });
}

/*****************
 * Logging
 *****************/

// Set logging level based on env
if (app.get('env') === 'development') {
  app.use(express.logger({immediate: true, format: 'dev'}));
  app.use(express.errorHandler());
} else {
  // Logging everything in prod will have performance implications at scale
  app.use(express.logger('default'));
}

// Log proxy actions
proxy.on('error', function(err, req) {
  console.log('[Proxy] Error!!! ', req.protocol + '://' + req.host + req.originalUrl, ' with ', err);
});

if (app.get('env') !== 'production') {
  proxy.on('start', function(req, res, target) {
    console.log('[Proxy] Start', req.protocol + '://' + req.host + req.originalUrl,
      'as', req.headers['x-forwarded-proto'], 'to', target.host
    );
  });
  proxy.on('end', function(req, res, response) {
    console.log('[Proxy] End ', req.protocol + '://' + req.host + req.originalUrl,
      'returned', response.headers.status
    );
  });
}

/*****************
 * Static Server and Less Middleware
 *****************/

var pubDir = path.join(__dirname, 'public');
var appDir = path.join(__dirname, 'app');
var inDev = app.get('env') === 'development';

app.use(express.compress());

app.use(lessmw(pubDir, {}, {
  paths: [path.join(__dirname, 'bower_components', 'lesshat', 'build')],
}, {
  compress: false
}));

app.use(express.static(pubDir));
app.engine('haml', hamlc.__express);
app.set('views', __dirname + '/app');

/*****************
 * Routing Logic
 *****************/

app.use(app.router);

function renderIndex(req, res) {
  res.sendfile(pubDir + '/views/index.html');
}

app.get('/', renderIndex);

app.all('/api/*', function (req, res) {
  req.headers.host = proxyData.host;
  if (req.headers.origin) { req.headers['X-Origin'] = req.headers.origin; }
  proxy.web(req, res);
});

if (app.get('env') === 'development') {
  // This is just template rendering;
  app.get('/static/*.html', function(req, res) {
    var templateFile = req.params + '.haml';
    res.render(templateFile);
  });

  app.get(/^\/app/, function(req, res) {
    fs.stat('.' + req.path, function(err, stat) {
        if(err === null) {
          res.sendfile('.' + req.path);
        } else if(err.code === 'ENOENT') {
          res.send(404);
        } else {
          throw(err);
        }
    });
  });
}

if (app.get('env') === 'production') {
  app.get(/^\/(js|css|images|files|vendor|views|templates|app|static)\//, function (req, res) {
    res.send(404);
  });
}

app.get('*', renderIndex);

if (app.get('env') === 'development') {
  https.createServer({}, app).listen(process.env.SSL_PORT || 3001);
}
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
