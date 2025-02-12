const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./config/db')

class Server{
    app = express();
    port
    routes
    cors = cors(); 

    constructor(options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.routes = routes;
        this.app.use( this.cors );
    }

    async start(){
        //* Middlewares
        this.app.use( express.json() );
        
        //* Routes
        this.app.use( this.routes );

        //* CORS
        this.app.use( this.cors );
    
        //* Public Folder
        // this.app.use( express.static( this.publicPath ) );

        //* Db Connection
        dbConnection(); 

        this.app.listen(this.port, () => {
        console.log(`Server running on port ${ this.port }`);
        });
    }
}

module.exports = { Server };