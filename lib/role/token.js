const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const accessToken = require('./accessToken');
const refreshToken = require('./refreshToken');
const utilsValue = require('../utils/value');

function removeAccessTokenAndRefreshToken(userId,devices,callback){

}

function generateAccessTokenAndRefreshToken(userId,devices,callback) {
    console.log('==generateAccessTokenAndRefreshToken===userId===',userId)
    console.log('==generateAccessTokenAndRefreshToken===devices===',devices)
    if(devices == 2 ||devices == 3 ){
        devices = '2,3'
    }
    accessToken.getAccessTokens(userId,'',devices,'','','',(result,data)=>{
        console.log('===getAccessTokens===result===',result)
        console.log('===getAccessTokens===data===',data)



        callback(data)

    })
}


exports.generateAccessTokenAndRefreshToken = generateAccessTokenAndRefreshToken
