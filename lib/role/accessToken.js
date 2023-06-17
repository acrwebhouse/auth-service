const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const utilsValue = require('../utils/value');

const accessTokenDoc = {
    token:'',
    userId:'',
    devices:0,
    refreshTokenId: '',
    exp : '',
    iat : '',
}

function newAccessTokenDoc(){
    const doc = JSON.parse(JSON.stringify(accessTokenDoc))
    return doc;
}

function removeAccessTokenByUserId(userId,devices){
    if(devices == 2 ||devices == 3 ){
        devices = '2,3'
    }
    accessToken.getAccessTokens(userId,'',devices,'','','',(result,data)=>{
        console.log('===getAccessTokens===result===',result)
        console.log('===getAccessTokens===data===',data)



        callback(data)

    })
}

function addAccessToken(userId,token,devices,exp,iat,refreshTokenId,callback) {
    const accessToken = {
        token,
        userId,
        devices,
        exp,
        iat,
        refreshTokenId,
    }
    const url = config['auth-basic-server'].location+'/'+config['auth-basic-server'].restApi.addAccessToken;
    const method = 'POST';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, accessToken, method, (error, body) => {
        if (error) {
            console.log('===addAccessToken==error=')
            console.log(error)
            console.log('===addAccessToken==body=')
            console.log(body)
            callback(false,body);
        } else {
            if (utilsValue.isValid(body.data.result)){
                if(body.data.result.ok == 1){
                    callback(true,body.data.ops[0]);
                }else{
                    callback(true,'insert fail');
                }
            }else{
                callback(false,body.data);
            }
        }
    });
}

function getAccessTokens(userId,token,devices,exp,iat,refreshTokenId,callback) {
    let url = config['auth-basic-server'].location+'/'+config['auth-basic-server'].restApi.getAccessTokens
    let preStr = '?';
    if(utilsValue.isValid(userId)){
        url = url + preStr + 'userId='+userId
        preStr = '&&'
    }
    if(utilsValue.isValid(token)){
        url = url + preStr + 'token='+token
        preStr = '&&'
    }
    if(utilsValue.isValid(devices)){
        url = url + preStr + 'devices='+devices
        preStr = '&&'
    }
    if(utilsValue.isValid(exp)){
        url = url + preStr + 'exp='+exp
        preStr = '&&'
    }
    if(utilsValue.isValid(iat)){
        url = url + preStr + 'iat='+iat
        preStr = '&&'
    }
    if(utilsValue.isValid(refreshTokenId)){
        url = url + preStr + 'refreshTokenId='+refreshTokenId
        preStr = '&&'
    }

    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getAccessTokens==url=')
            console.log(url)
            console.log('===getAccessTokens==error=')
            console.log(error)
            console.log('===getAccessTokens==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                const data = res.data
                callback(true,data);
            }catch(e){
                console.log(e)
                callback(false,"data format error: "+e);
            }
        }
    });
}

function removeAccessTokens(ids,callback) {
    if (utilsValue.isValid(ids)){
        const url = config['auth-basic-server'].location+'/'+config['auth-basic-server'].restApi.removeAccessTokens;
        const method = 'DELETE';
        const headers = {};
        const json = {
            ids:ids
        }
        httpRequest.sendJsonRequest(url, headers, json, method, (error, body) => {
            if (error) {
              console.log('===removeAccessTokens==error=')
              console.log(error)
              console.log('===removeAccessTokens==body=')
              console.log(body)
              callback(false,body);
            } else {
              if(body.data.nModified > 0){
                callback(true,'remove '+body.data.nModified+' access token');
              }else{
                callback(false,'no match id');
              }
            }
          });
    }else {
        callback(false, 'id invalid')
    }
}

exports.newAccessTokenDoc = newAccessTokenDoc
exports.addAccessToken = addAccessToken
exports.getAccessTokens = getAccessTokens
exports.removeAccessTokens = removeAccessTokens
