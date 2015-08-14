'use strict';

var assert = require("assert");
var qs = require('../util/qs');
var signature = require('../util/signature');

var Api = require('../models/api.js');
//var Merchant = require('../models/merchant.js');
//var MerchangApiConfig = require('../models/merchantapiconfig.js');

var expect = require('chai').expect;  // BDD/TDD assertion library
require('co-mocha');                  // enable support for generators in mocha tests using co

let app = require('../server.js');

describe('OpenAPI'+' ('+app.env+'/'+require('../config/db-'+app.env+'.json').db.database+')', function() {
  describe('#qs.stringify', function () {
    it('should return natural sortted stringify string', function () {
      var params = {'a': 1,'c': 3,'d': 4,'b': 2};
      assert.equal('a=1&b=2&c=3&d=4', qs.stringify(params));
    });
  });
  
  describe('#signature.verify', function () {
    it('should return true when verify the signature', function () {
      var params = {'a': 1,'c': 3,'d': 4,'b': 2};
      var dkey = "MIIEoQIBAAKCAQByFLa9n25jX1kgTfXi4pIBgsGPANUVVHFfZKgCDSApOKOpvw4HAfoXVbDpuY4JP9mxt9ZW1/0Kqbakd64wtgNdqUEL1y1BAZNPsrvQg04SuWYKzUf5octdP+0zrOL+QhsLErAV7woUt3HQS4pzEWsnyDFhj4kj2PCOsLPmNJa4f96yAOKa8+n2iFgqxYbkUrCfyVkQmtp5N65focSdtUfo6ZyRFfpqp3UEampM3SMPEpl4iIwQ/y1WMd0u2zT6D6VAcZSnNeZlVzsPbCqnupqgxUO01pVCiGD4QhbRe+wNjt8lYiv+heqaeqRlMrsP061xaffNYnKdsyfQCaKNbJm5AgMBAAECggEAGWC4QjicQujsF76gC2fhmQpwapKB1GvjiJgIs+Qdmm3qIpHI2hA7hUNfxq6rhS06DUnbGZiUxvF4GuAw1M84snY7bRniDEsAbUNSepErJgkuRQrjjwnKBqV46/zyxiMIhw8SMt7pPDCO1gpn8y8VylTDf3OBy4KwCN4QNw7N1J73tcgK+m1GIMFJCp8Cn/x6Od2tyW+1hhYsbLHH/mMot8+1/2vKU5OltwbaAdw8mB0ijIYb4Gdnt2czGc3/kQXDR6HsQhg6KdDtOTVgCtW5lT6jGtTZOu/L0jyncDr8blSrI4MGYEfZFJUCqLkEnYnK6zbTiOT/oZgQO70d6zyfsQKBgQDTZsd7o3z/aWFdi8lNo5JVJcPUQ6N5gfSSCAEcnFktEtappRMgSvKeeQrs3L7c3qU1r59xr7M5bt2VOhA811Uq8KDU9f9lBBuIp5jDgPJZIYskI02i1al6+GJOcztBvIFcrx3Nvhp5qQraw8An39sM+7JYvX4N8wHs5kGh86ledQKBgQCKJeokkOCh2sIM7+8Du0wgk3eJ6I+nzfMwPVHfTBchFoKGfVrY3uUNJIRdRiWSKbltqMPer7Hmr0fgDnsMqY/kA1cZNdTRPVuIFbUAxqFoKd3Ojutd7abRUFdMYe7Bk8/wELM0qlWtuf/t6cxiyJvaFwp4sxAx6M490GJSPwFttQKBgBuqqtbKibRflUeJ4NmRW7hbDer8wytGz7xA4exdpeoZOhDPstYaGPCWhNCE/1GmrdZ92o8lYH5WvRcnlzJvOA07msDkRP1ycSwMSxjjClSR6ETdfe6eqeSXFz6PJCUxR3jazjq783kSn4IL9l0Blgh39FpaymGG+SyI4fQREIx1AoGAIKD5328Uj0Xy5UlaQ6BeR6ds6XazT2f2U2N4TexT3i3J4GgFKAnlQahpVvp1b0NJl5vvv03yD9FAgawJ5iC6aplbXgn33P/H+ale2fMQNmEFEX9yGfpCl1eJdvH+iVwXFdVr7jl5CRJQX2oEKyTEosskXwO0BIW/CJyKTHCzLq0CgYBIJ2q/7qIkBrCxQbmcVfst9V0VB3fzIZAMTElWZ7zIbZrCEvwLKPcI75U1i4jr8H5R9tyyG8pGcYem8DWnRkFrnnvXH5s2XkmcTBguvKMe3hvvI+MwILH4ROjt5K3HCTHWBTcmMRSY6pn1B8aj85qUS6jcUf4rzfGteZDynJgTYw==";
      var ekey = "MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQByFLa9n25jX1kgTfXi4pIBgsGPANUVVHFfZKgCDSApOKOpvw4HAfoXVbDpuY4JP9mxt9ZW1/0Kqbakd64wtgNdqUEL1y1BAZNPsrvQg04SuWYKzUf5octdP+0zrOL+QhsLErAV7woUt3HQS4pzEWsnyDFhj4kj2PCOsLPmNJa4f96yAOKa8+n2iFgqxYbkUrCfyVkQmtp5N65focSdtUfo6ZyRFfpqp3UEampM3SMPEpl4iIwQ/y1WMd0u2zT6D6VAcZSnNeZlVzsPbCqnupqgxUO01pVCiGD4QhbRe+wNjt8lYiv+heqaeqRlMrsP061xaffNYnKdsyfQCaKNbJm5AgMBAAE=";

      var plaintext = qs.stringify(params);
      var signatureText = signature.sign(dkey,params);
      
      assert.equal(true, signature.verify(ekey, params, signatureText ));
    });
  });
  
  describe('#Api.getAll', function () {
    it('should return true when verify the signature', function () {
      var apis = yield Api.getAll();
      console.log(apis);
      assert.equal(true, apis.length>0);
    });
  });
});