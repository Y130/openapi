'use strict';

let koa          = require('koa');
let responseTime = require('koa-response-time');
let cors         = require('koa-cors');
let fs           = require('fs');
let mysql        = require('mysql-co');
let bodyParser   = require('koa-bodyparser');
let _            = require('underscore');
let api          = require('./util/api');

let app = module.exports = koa();

app.use(function *(next){
  this.type = 'json';
  try {
    yield next;
  } catch (err) {
    // some errors will have .status
    // however this is not a guarantee
    //this.status = err.status || 500;
    this.body = {success:false, message: err.message, errorCode: err.code|| err.status || 500};

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    this.app.emit('error', err, this);
  }
});

// return response time in X-Response-Time header
app.use(responseTime());
app.use(cors());

app.use(bodyParser());

// MySQL connection pool TODO: how to catch connection exception eg invalid password?
let config = require('./config/db-'+app.env+'.json');
GLOBAL.connectionPool = mysql.createPool(config.db); 

app.use(function *(next){
  var method = this.method;
  if (method !== 'POST' && method !== 'GET'){
    yield next;
  }else{
    var params = method == 'POST' ? this.request.body : this.request.query;
    if(!_.isEmpty(params)){
      this.body = yield api.exchange(method, params);
    }
    yield next;
  }
});

app.on('error', function(err){
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

if (!module.parent) {
  app.listen(process.env.PORT||3000);
  let db = require('./config/db-'+app.env+'.json').db.database;
  api.init();
  console.log(process.version+' listening on port '+(process.env.PORT||3000)+' ('+app.env+'/'+db+')');
}
