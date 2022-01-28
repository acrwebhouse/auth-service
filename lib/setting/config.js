require('dotenv').config()
exports.config = {
    'serverIp':process.env.SERVER_IP || '127.0.0.1',
    'serverPort': process.env.SERVER_PORT || 3000,
    'user-basic-server':{
        location: process.env.USER_BASIC_LOCATION ||'http://127.0.0.1:13000',
        restApi:{
            'addUser':'user/addUser',
            'getUser':'user/getUser',
        }
    },
    'swaggerIp':process.env.SWAGGER_IP || '127.0.0.1',
}