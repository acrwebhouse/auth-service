require('dotenv').config()
exports.config = {
    'serverIp':process.env.SERVER_IP || '127.0.0.1',
    'serverPort': process.env.SERVER_PORT || 3000,
    'user-basic-server':{
        location: process.env.USER_BASIC_LOCATION ||'http://127.0.0.1:13000',
        restApi:{
            'addUser':'user/addUser',
            'getUser':'user/getUser',
            'getUserNoPassword':'user/getUserNoPassword',
        }
    },
    'smtp-basic-server':{
        location: process.env.SMTP_BASIC_LOCATION ||'http://127.0.0.1:16000',
        restApi:{
            'sendMail':'smtp/sendMail'
        }
    },
    'web-server':process.env.WEB_LOCATION ||'http://34.81.209.11:8080',
    'swaggerIp':process.env.SWAGGER_IP || '127.0.0.1',
}