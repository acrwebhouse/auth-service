exports.on = function(app) {
    const preRestApi = '/auth';
    const user = require('../role/auth');

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
        const response = {
            'status':true,
            'data':''
        }
        res.send(response);
    });

    app.post(preRestApi + '/login', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Add a user',
            schema: {
                account: 'a123456789',
                password: 123456,
            }
        }*/ 
        const account = req.body.account
        const password = req.body.password
        const response = {
            'status':true,
            'data':''
        }
        res.send(response);
    });
}