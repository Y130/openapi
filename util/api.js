'use strict';

var cache = require('memory-cache');
var co = require('co');
var underscore = require('underscore');

var Api = require('../models/api');
var Merchant = require('../models/merchant');
var MerchangApiConfig = require('../models/merchantapiconfig');
var constant = require('../models/constant');
var errorenum = require('../models/errorenum');
var ApiError = require('../models/apierror');
var signature = require('./signature');
var ws = require('./ws');

var akey = constant['API_CACHE_KEY_FORMAT'];
var mkey = constant['MERCHANT_CACHE_KEY_FORMAT'];
var ckey = constant['MERCHANTAPICONFIG_CACHE_KEY_FORMAT'];

module.exports = {};

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
};

function areNotEmpty(values){
  var result = true;
  if (underscore.isEmpty(values)) {
    result = false;
  } else {
    values.forEach(function(value){
      result = result && !underscore.isEmpty(value);
    });
  }
  return result;
}

function* init() {
  GLOBAL.db = yield GLOBAL.connectionPool.getConnection();
  var apis = yield Api.getAll()
  , merchants = yield Merchant.getAll()
  , macs = yield MerchangApiConfig.getAll()
  ;

  apis.forEach(function(item, index){
    cache.put(akey.format(item['name'],item['version']),item);
  });

  merchants.forEach(function(item, index){
    cache.put(mkey.format(item['id']),item);
  });

  macs.forEach(function(item, index){
    cache.put(ckey.format(item['merchantid'], item['apiid']),item);
  });

  GLOBAL.db.release();
};

function* getCacheValue(key){
  var obj = cache.get(key);
  if(underscore.isEmpty(obj)){
    yield init();
    obj = cache.get(key);
  }
  
  if(underscore.isEmpty(obj)){
    var en = errorenum['Param_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }
  
  return obj;
}

module.exports.init = co.wrap(init);

module.exports.exchange = function*(httpmethod, params){
  var merchantId = params[constant['MERCHANT']]
  , method = params[constant['METHOD']]
  , version = params[constant['VERSION']]
  , sign = params[constant['SIGN']]
  , signType = params[constant['SIGN_TYPE']]
  , charset = params[constant['CHARSET']]
  , en
  ;

  //核心参数判空
  if(!areNotEmpty([merchantId,method,version,sign,signType,charset])){
    en = errorenum['Param_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }
  
  if(signType !== constant['SIGN_TYPE_RSA']){
    en = errorenum['Sign_Type_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }
  
  if(charset !== constant['CHARSET_UTF8']){
    en = errorenum['Charset_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }

  //商户验证：存在与否，是否有API权限
  var m = yield getCacheValue(mkey.format(merchantId));

  if(underscore.isEmpty(m)){
    en = errorenum['Merchant_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }

  var a = yield getCacheValue(akey.format(method, version));

  if(underscore.isEmpty(a)){
    en = errorenum['Api_Not_Support'];
    throw ApiError(en[0],en[1]);
  }
  
  if(httpmethod !== a['method']){
    en = errorenum['Method_Not_Allowed'];
    throw ApiError(en[0],en[1]);
  }

  var c = yield getCacheValue(ckey.format(merchantId,a['id']));

  if(underscore.isEmpty(c)){
    en = errorenum['Merchant_No_Authority'];
    throw ApiError(en[0],en[1]);
  }

  //签名验证
  var ekey = m['ekey'], url = a['url'], hm =a['method'];
  
  if(!areNotEmpty([ekey,url,hm])){
    en = errorenum['Config_Error'];
    throw ApiError(en[0],en[1]);
  }

  delete params[constant['SIGN']];

  var isValid = signature.verify(ekey, params, sign);

  if(isValid){
    wrapper();
    return yield* ws(hm,url,params);
  }else{
    en = errorenum['Sign_Not_Valid'];
    throw ApiError(en[0],en[1]);
  }
  
  function wrapper(){
    delete params[constant['MERCHANT']];
    delete params[constant['METHOD']];
    delete params[constant['VERSION']];
    delete params[constant['SIGN']];
    delete params[constant['SIGN_TYPE']];
    delete params[constant['CHARSET']];
  }
}





