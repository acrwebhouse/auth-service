const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const accessToken = require('./accessToken');
const refreshToken = require('./refreshToken');
const utilsValue = require('../utils/value');

function removeAccessTokenAndRefreshToken(userId,devices,callback){
    let removeDevices = ''
    if(devices == 2 ||devices == 3 ){
        removeDevices = '2,3'
    }
    
    accessToken.removeAccessTokensByUserIdAndDevices(userId,devices,(result,data)=>{
        if(result == true){
            refreshToken.removeRefreshTokensByUserIdAndDevices(userId,devices,callback)
        }else{
            callback(result,data)
        }
    })    
}

function generateAccessTokenAndRefreshToken(userId,devices,callback) {
    removeAccessTokenAndRefreshToken(userId,devices,(result,data)=>{
        const callbackRes = {
            accessToken : '',
            refreshToken : '',
        }
        if(result == true){
            refreshToken.addRefreshToken(userId,devices,(result,data)=>{
                if(result == true){
                    const refreshTokenId = data._id
                    accessToken.generateAccessToken(userId,(result,token)=>{
                        if(result == true){
                            const decoded = utilsValue.jwtDecode(token)
                            accessToken.addAccessToken(userId,token,devices,decoded.exp,decoded.iat,refreshTokenId,(result,data)=>{
                                if(result == true){
                                    callbackRes.accessToken = token
                                    callbackRes.refreshToken = refreshTokenId
                                    callback(result,callbackRes)
                                }else{
                                    callback(result,data)
                                }
                            })
                        }else{
                            callback(result,data)
                        }
                    }) 
                }else{
                    callback(result,data)
                }

            })
        }else{
            callback(result,data)
        }
    })

}


exports.generateAccessTokenAndRefreshToken = generateAccessTokenAndRefreshToken
