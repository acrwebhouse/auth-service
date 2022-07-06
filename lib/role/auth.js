const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');

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
    bornDate:'',
    verify:false,
    isDelete:false,
}

function newUserDoc(){
    const doc = JSON.parse(JSON.stringify(userDoc))
    return doc;
}
function signUp(account,password,name,gender,roles,rolesInfo,houseIds,phone,address,mail,bornDate,callback) {
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
              callback(body.status,body.data);
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
                            callback(result,data)
                        }else{
                            data.token = generateToken(data)
                            callback(result,data)
                        }
                    })
                }else{
                    if(result == false || data == null){
                        callback(result,data)
                    }else{
                        data.token = generateToken(data)
                        callback(result,data)
                    }
                }
            })
        }else{
            loginByAccount(accountOrMail,password,(result,data)=>{
                if(result == false || data == null){
                    callback(result,data)
                }else{
                    data.token = generateToken(data)
                    callback(result,data)
                }
            })
        }
    }else {
        callback(false, 'accout , mail or password invalid')
    }
}

exports.signUp = signUp
exports.login = login
