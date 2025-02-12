const {Router} = require('express');
const {authMiddleware} = require('../../middleware/session');

const {UserController} = require('./controller')

class UserRouter{

    static get routes(){
        const router = Router();

        router.get('/', UserController.ping);
        router.get('/getAll', authMiddleware, UserController.getUsers)
        router.post('/register', UserController.register);
        router.post('/login', UserController.login)

        return router;
    }
}

module.exports = {UserRouter};