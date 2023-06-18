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
    console.log('==generateAccessTokenAndRefreshToken===userId===',userId)
    console.log('==generateAccessTokenAndRefreshToken===devices===',devices)
    // let removeDevices = ''
    // if(devices == 2 ||devices == 3 ){
    //     removeDevices = '2,3'
    // }

    removeAccessTokenAndRefreshToken(userId,devices,(result,data)=>{
        if(result == true){
            refreshToken.addRefreshToken(userId,devices,(result,data)=>{
                console.log('==addRefreshToken===result===',result)
                console.log('==addRefreshToken===data===',data)

                if(result == true){
                    const refreshTokenId = data._id
                    accessToken.generateAccessToken(userId,(result,data)=>{
                        if(result == true){
                            callback(result,data)
                        }else{
                            callback(result,data)
                        }
                    })
                    // addAccessToken(userId,token,devices,exp,iat,refreshTokenId,callback)
                    
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
