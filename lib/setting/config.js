exports.config = {
    'serverPort': 3000,
    'user-basic-server':{
        location:'http://127.0.0.1:13000',
        restApi:{
            'addUser':'user/addUser',
            'getUser':'user/getUser',
        }
    }
}