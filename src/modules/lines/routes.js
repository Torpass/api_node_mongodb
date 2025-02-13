const {Router} = require('express');
const {authMiddleware} = require('../../middleware/session');
const LineController = require('./controller')

class LineRouter{

    static get routes(){
        const router = Router();

        router.post('/create', authMiddleware, LineController.register);
        router.get('/getLinesByMovement', authMiddleware, LineController.getLineByMovement);
        router.delete('/delete', authMiddleware, LineController.deleteLines);
        return router;
    }
}
5
module.exports = {LineRouter};