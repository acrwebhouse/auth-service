const uuid = require('node-uuid');
const sign = require('jwt-encode');
const decode = require('jwt-decode');

exports.jwtEncode = function(data) {
    const secret = 'secret';
    const jwt = sign(data, secret);
    return jwt
}

exports.jwtDecode = function(token) {
    return decode(token);
}

exports.isValid = function(value) {
    if (value != '' && value != undefined && value != null) {
        return true;
    } else {
        return false;
    }
}

exports.isNumber = function isNumber(value) {
  return !Number.isNaN(Number(value))
}

exports.getUUID = function() {
   return parseInt(uuid.v4(), 16).toString();
}

exports.getCurrentTime = function() {
    const currentdate = new Date(); 
    const datetime =  currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + "  "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
 }
