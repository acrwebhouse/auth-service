const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');
const errorMessage = require('../utils/error').message;

const userDoc = {
    account:'',
    password:'',
    name:'',
    gender: true,
    roles:[],
    rolesInfo:{},
    houseIds:[],
    phone:'',
    address:'',
    mail:'',
    lineId:'',
    bornDate:'',
    verify:false,
    isDelete:false,
}

function newUserDoc(){
    const doc = JSON.parse(JSON.stringify(userDoc))
    return doc;
}
function signUp(account,password,name,gender,roles,rolesInfo,houseIds,phone,address,mail,lineId,bornDate,callback) {
    if (utilsValue.isValid(account) && utilsValue.isValid(password)){
        const doc = newUserDoc()
        doc.account = account
        doc.password = password
        doc.address = address
        doc.houseIds = houseIds
        doc.phone = phone
        doc.name = name
        doc.gender = gender
        doc.roles = roles
        doc.rolesInfo = rolesInfo
        doc.mail = mail
        if(utilsValue.isValid(lineId)){
            doc.lineId = lineId
        }
        doc.bornDate = bornDate
        const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.addUser;
        const method = 'POST';
        const headers = {
            'Content-Type': 'application/json'
        };
        httpRequest.sendJsonRequest(url, headers, doc, method, (error, body) => {
            if (error) {
              callback(false,body);
            } else {
              const status = body.status
              let data = body.data
              if( status === false){
                if(data.indexOf('duplicate')>0){
                    if(data.indexOf('account')>0){
                        data = errorMessage.accountIsExist
                    }
                    if(data.indexOf('mail')>0){
                        data = errorMessage.mailIsExist
                    }
                  }
              }
              callback(status,data);
            }
          });
    }else {
        callback(false, 'accout or password invalid')
    }
}

function loginByAccount(account,password,callback){
    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUser+'?account='+account+'&&password='+password+'&&isDelete=false';
    const method = 'GET';
    const headers = {
        'Content-Type': 'application/json'
    };
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        try {
            body = JSON.parse(body)
        }catch(e){
            error = true
        }
        if (error) {
            callback(false,body);
        } else {
            callback(body.status,body.data);
        }
    });
}

function loginByMail(mail,password,callback){
    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUser+'?mail='+mail+'&&password='+password+'&&isDelete=false';
    const method = 'GET';
    const headers = {
        'Content-Type': 'application/json'
    };
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        try {
            body = JSON.parse(body)
        }catch(e){
            error = true
        }
        if (error) {
            callback(false,body);
        } else {
            callback(body.status,body.data);
        }
    });
}

function generateToken(user){
    const data = {
        id:user._id,
        roles:user.roles,
        expired:config.token.useExpired,
        iat:new Date()
    }
    const token = utilsValue.jwtEncode(data)
    return token;
}

function login(accountOrMail,password,callback) {
    if (utilsValue.isValid(accountOrMail) && utilsValue.isValid(password)){
        if(accountOrMail.indexOf('@')>=0){
            loginByMail(accountOrMail,password,(result,data)=>{
                if(result == false || data == null){
                    loginByAccount(accountOrMail,password,(result,data)=>{
                        if(result == false || data == null){
                            callback(false,errorMessage.accountMailOrPasswordInvalid)
                        }else if(result == true && data.verify == false){
                            callback(false,errorMessage.userNotVerify)
                        }
                        else{
                            data.token = generateToken(data)
                            callback(result,data)
                        }
                    })
                }else{
                    if(result == false || data == null){
                        callback(result,errorMessage.accountMailOrPasswordInvalid)
                    }else if(result == true && data.verify == false){
                        callback(false,errorMessage.userNotVerify)
                    }else{
                        data.token = generateToken(data)
                        callback(result,data)
                    }
                }
            })
        }else{
            loginByAccount(accountOrMail,password,(result,data)=>{
                if(result == false || data == null){
                    callback(false,errorMessage.accountMailOrPasswordInvalid)
                }else if(result == true && data.verify == false){
                    callback(false,errorMessage.userNotVerify)
                }else{
                    data.token = generateToken(data)
                    callback(result,data)
                }
            })
        }
    }else {
        callback(false, errorMessage.accountMailOrPasswordInputInvalid)
    }
}

function verifyUserTime(iat , expired){
    const now = new Date()
    const old = new Date(iat)
    const diff = now.getTime() - old.getTime()
    if(diff < expired){
        return true
    }else{
        return false
    }
}

function getUserById(id,callback){
    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUserById+'?id='+id+'&&isDelete=false';
    const method = 'GET';
    const headers = {
        'Content-Type': 'application/json'
    };
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        try {
            body = JSON.parse(body)
        }catch(e){
            error = true
        }
        if (error) {
            callback(false,body);
        } else {
            callback(body.status,body.data);
        }
    });
}

function editUser(user,callback){
    const id = user._id
    delete user['createTime'];
    delete user['updateTime'];
    delete user['_id'];
    user.id = id
    user.verify = true
    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.editUser;
    const method = 'PUT';
    const headers = {};

    httpRequest.sendJsonRequest(url, headers, user, method, (error, body) => {
        if (error) {
            callback(false,body);
        } else {
            if(body.data.nModified > 0){
                const result = body.data.updateData
                callback(true,result);
            }else{
                callback(false,'no match id');
            }
        }
    });
}

function verifyUser(token,callback){
    const decodeToken = utilsValue.jwtDecode(token)
    const id = decodeToken.id
    const iat = decodeToken.iat
    const expired = decodeToken.expired*1
    if(verifyUserTime(iat , expired)){
        getUserById(id,(result,data)=>{
            if(result){
                editUser(data,(result,data)=>{
                    if(result){
                        data.token = generateToken(data)
                        callback(true,data)
                    }else{
                        callback(false,data)
                    }
                })
            }else{
                callback(false,'query user fail')
            }
        })
        
    }else{
        callback(false,'time expired')
    }
    
}

exports.signUp = signUp
exports.login = login
exports.verifyUser = verifyUser
