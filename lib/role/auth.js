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
    isDelete:false,
}

function newUserDoc(){
    const doc = JSON.parse(JSON.stringify(userDoc))
    return doc;
}
function signUp(account,password,name,gender,roles,rolesInfo,houseIds,phone,address,callback) {
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

function login(account,password,callback) {
    if (utilsValue.isValid(account) && utilsValue.isValid(password)){
        
        const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.addUser+'?account='+account+'&&password='+password;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json'
        };
        httpRequest.sendGetRequest(url, headers, method, (error, body) => {
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

exports.signUp = signUp
