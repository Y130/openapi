var qs = require('./qs');
var crypto = require('crypto');

function wordwrap(str, width) {
  width = width || 64;
  if (!str) {
    return str;
  }
  var regex = '(.{1,' + width + '})( +|$\n?)|(.{1,' + width + '})';
  return str.match(RegExp(regex, 'g')).join('\n');
};

/**
 * Retrieve the pem encoded private key
 * @returns {string} the pem encoded private key with header/footer
 * @public
 */
function getPrivateKey (dkey) {
  var key = "-----BEGIN RSA PRIVATE KEY-----\n";
  key += wordwrap(dkey) + "\n";
  key += "-----END RSA PRIVATE KEY-----";
  return key;
};

/**
 * Retrieve the pem encoded public key
 * @returns {string} the pem encoded public key with header/footer
 * @public
 */
function getPublicKey(ekey) {
  var key = "-----BEGIN PUBLIC KEY-----\n";
  key += wordwrap(ekey) + "\n";
  key += "-----END PUBLIC KEY-----";
  return key;
};

var sign = function(dkey, params){
  var key = getPrivateKey(dkey);
  var plaintext = qs.stringify(params);
  var signer = crypto.createSign('RSA-SHA1');
  signer.update(plaintext);
  return signer.sign(key,'base64');
};

var verify = function (ekey, params, signature){
  var isValid = false;
  try{
    var key = getPublicKey(ekey);
    var plaintext = qs.stringify(params);
    var verifier = crypto.createVerify('RSA-SHA1');
    verifier.update(plaintext)
    isValid = verifier.verify(key, signature,'base64');
  }catch(e){}
  return isValid;
}

module.exports = {
  'sign': sign,
  'verify': verify
};