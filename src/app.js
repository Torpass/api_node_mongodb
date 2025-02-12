const { AppRouter } = require('./routes'); 
const { Server } = require('./server');
const {envs}  = require('./config/envs');

(async()=> {
    main();
})();
    
function main() {
    const server = new Server({
        port: envs.PORT,
        routes: AppRouter.routes,
    });

    server.start();
}