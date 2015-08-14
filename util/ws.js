var qs = require('querystring');
var url = require('url');
var _ = require('underscore');
var ApiError = require('../models/apierror');

var request = require('./cogent').extend({
  'json'   :true,
  'gunzip' :true,
  'timeout': 10000,
  'headers': {'content-type': 'application/json'}
});

module.exports = function *(method, uri, params){
  method = method.toLowerCase();
  if(_.contains(['get','post','delete','put'],method))
  {
    return yield* request(uri,{
      'method': method
    },params);
  }
  else
  {
    var en = errorenum['Method_Not_Allowed'];
    throw ApiError(en[0],en[1]);
  };
};


