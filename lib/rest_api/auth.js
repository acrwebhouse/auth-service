exports.on = function(app) {
    const preRestApi = '/auth';
    const auth = require('../role/auth');

    app.post(preRestApi + '/signUp', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Add a user',
            schema: {
                account: 'a123456789',
                password: 123456,
                name: 'Chris',
                gender: true,
                roles: [1,2,3,4],
                rolesInfo: {
                    admin:{},
                    host:{},
                    user:{},
                    sales:{},
                },
                houseIds:[],
                phone: '0909666666',
                mail: 'acr.webhouse@gmail.com',
                address: '台北市文山區興隆路六段66號6樓'
            }
        }*/ 
        const account = req.body.account
        const password = req.body.password
        const name = req.body.name
        const gender = req.body.gender
        const roles = req.body.roles
        const rolesInfo = req.body.rolesInfo
        const houseIds = req.body.houseIds
        const phone = req.body.phone
        const address = req.body.address
        const mail = req.body.mail
        const response = {
            'status':true,
            'data':''
        }
        auth.signUp(account,password,name,gender,roles,rolesInfo,houseIds,phone,address,mail,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.post(preRestApi + '/login', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Add a user',
            schema: {
                accountOrMail: 'a123456789',
                password: 123456,
            }
        }*/ 
        const accountOrMail = req.body.accountOrMail
        const password = req.body.password
        const response = {
            'status':true,
            'data':''
        }
        
        auth.login(accountOrMail,password,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });
}