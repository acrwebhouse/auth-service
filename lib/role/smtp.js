const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');

function getUser(mail,account,callback){
    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUserNoPassword+'?mail='+mail+'&&account='+account+'&&isDelete=false';
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

function getResetPasswordSubject(){
    return 'ACR platform 重設密碼通知信'
}

function getResetPasswordContent(name,resetLink){
    let first = '';
    if(utilsValue.isValid(name)){
        first += '親愛的 '+name+' 您好'
    }else{
        first += '親愛的您好'
    }
    first += '，您已於 '+utilsValue.getCurrentTime()+' 重新設定您的密碼。'
    const second = `請點選下方連結設定您的新密碼 <br> ${resetLink}`
    const third = `如有任何問題，可寄客服 mail 與我們聯絡，謝謝。<br>acr.webhouse@gmail.com'`
    const content = `<div style=color:black;>${first}<div/><div style=color:black;>${second}<br><div/><div style=color:black;>${third}<div/>`
    return content
}

function sendMail(toMail,subject,content,callback){
    const url = config['smtp-basic-server'].location+'/'+config['smtp-basic-server'].restApi.sendMail;
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json'
    };
    const doc = {
        toMail,
        subject,
        content,
    }
    httpRequest.sendJsonRequest(url, headers, doc, method, (error, body) => {
        if (error) {
          callback(false,body);
        } else {
          callback(body.status,body.data);
        }
      });
}

function getResetPasswordToken(user){
    const data = {
        id:user._id,
        iat:new Date()
    }
    return utilsValue.jwtEncode(data)
}

function sendResetPasswordMail(accountOrMail,callback) {
    if (utilsValue.isValid(accountOrMail)){
        let resetLink = config['web-server'];
        if(accountOrMail.indexOf('@')>=0){
            const mail = accountOrMail;
            getUser(mail,'',(result,user)=>{                
                if(result){
                    resetLink = resetLink + '/reset-password?key=' + getResetPasswordToken(user)
                    const name = user.name
                    const subject = getResetPasswordSubject();
                    const content = getResetPasswordContent(name,resetLink);
                    sendMail(accountOrMail,subject,content,callback)
                }else{
                    callback(false, 'query user fail by mail')
                }
            })
        }else{
            const account = accountOrMail;
            getUser('',account,(result,user)=>{               
                if(result){    
                    resetLink = resetLink + '/reset-password?key=' + getResetPasswordToken(user)
                    const name = user.name
                    const subject = getResetPasswordSubject();
                    const content = getResetPasswordContent(name,resetLink);
                    const mail = user.mail;
                    sendMail(mail,subject,content,callback)
                }else{ 
                    callback(false, 'query user fail by account')
                }
            })
        }
    }else {
        callback(false, 'accout or mail invalid')
    }
}

exports.sendResetPasswordMail = sendResetPasswordMail
