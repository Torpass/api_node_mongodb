const mongoose = require('mongoose');
const {envs} = require('./envs');

const dbConnection = async  () =>{
    try{
        const dbUrl = envs.DBHOST; 
        await mongoose.connect(dbUrl);
        console.log('*** Successful Database Connection ***');    
    }catch(e){
        console.log('*** Database Connection Error *** ')
        console.log(e);
    }
}
    

module.exports = {dbConnection}