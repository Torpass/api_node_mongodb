const {Router} = require('express');
const {UserRouter} = require('./modules/users/routes');
const {ProjectRouter} = require('./modules/projects/routes');
const {MovementRouter} = require('./modules/movements/routes');

class AppRouter{
    static get routes(){
        const router = Router();
        
        router.use('/api/users', UserRouter.routes);
        router.use('/api/projects', ProjectRouter.routes);
        router.use('/api/movements', MovementRouter.routes);

       
        return router;
    }
}

module.exports = {AppRouter};