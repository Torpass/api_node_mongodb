const {Router} = require('express');
const {UserRouter} = require('./modules/users/routes');

class AppRouter{
    static get routes(){
        const router = Router();
        
        router.use('/api/users', UserRouter.routes);

       
        return router;
    }
}

module.exports = {AppRouter};