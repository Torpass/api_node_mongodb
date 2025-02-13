const {Router} = require('express');
const {authMiddleware} = require('../../middleware/session');
const ProjectController = require('./controller')

class ProjectRouter{

    static get routes(){
        const router = Router();

        router.post('/create', authMiddleware, ProjectController.register);
        router.get('/getProjectsByUser', authMiddleware, ProjectController.getProjectsByUser);
        return router;
    }
}
5
module.exports = {ProjectRouter};