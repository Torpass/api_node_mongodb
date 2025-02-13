const {Router} = require('express');
const {authMiddleware} = require('../../middleware/session');
const MovementController = require('./controller')

class MovementRouter{

    static get routes(){
        const router = Router();

        router.post('/create', authMiddleware, MovementController.register);
        router.get('/getMovementByProject', authMiddleware, MovementController.getMovementByProject);
        router.delete('/delete', authMiddleware, MovementController.deleteMovements);
        return router;
    }
}
5
module.exports = {MovementRouter};