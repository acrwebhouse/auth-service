const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const utilsValue = require('../utils/value');
const user = require('./user')
const accessTokenTime = config.token.accessTokenTime

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

function generateAccessToken(userId,callback){
    
    user.getUserAndCurrentEmployeeById(userId,(result,data)=>{
        let token = ''
        if(result == true){
            const tokenData = {
                id:userId,
                employee :{},
                roles : data.roles,
                exp: new Date(new Date().getTime()+accessTokenTime),
                iat: new Date()
               }
            if(utilsValue.isValid(data.employee) && utilsValue.isValid(data.employee._id)){
                tokenData.employee.id = data.employee._id
                tokenData.employee.companyId = data.employee.companyId
                tokenData.employee.rank = data.employee.rank
                tokenData.employee.state = data.employee.state
            }
            console.log(tokenData)
            console.log(accessTokenTime)
            token = utilsValue.jwtEncode(tokenData)
        }
        callback(result,token)

    })
}

function removeAccessTokensByUserIdAndDevices(userId,devices,callback) {
    getAccessTokens(userId,'',devices,'','','',(result,data)=>{
        if(result == true){
            const removeIds = []
            for(let i = 0 ;i<data.length;i++){
                removeIds.push(data[i]._id)
            }
            if(removeIds.length > 0){
                removeAccessTokens(removeIds,callback)
            }else{
                callback(result,data)
            }
        }else{
            callback(result,data)
        }
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
                if(body.status == true){
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
exports.removeAccessTokensByUserIdAndDevices = removeAccessTokensByUserIdAndDevices
exports.generateAccessToken = generateAccessToken

