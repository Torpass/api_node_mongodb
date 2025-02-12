const {JsonWebTokenError} = require('jsonwebtoken');
const jsonwebtoken = require('jsonwebtoken');
const {envs} = require('../config/envs');
const SECRET_KEY = envs.JTW_SECRET;

console.log(SECRET_KEY)


/**
 * Debes de pasar el objeto del usuario
 * @param {*} user 
 */
const tokenSign = async (user) =>{
    const token = await jsonwebtoken.sign(
        {
            email: user.email,
        },
        SECRET_KEY, 
        {
            expiresIn: '2h'
        }
    );

    return token;
}

/**
 * Pasar como parametro el token de sesion (El jwt)
 * @param {*} tokenJWT 
 */
const tokenVerify = async (tokenJWT) => {
    try{
        const userData = jsonwebtoken.verify(tokenJWT, SECRET_KEY);
        return userData;
    }catch(error){
        error = JsonWebTokenError;
        if (error.name === 'TokenExpiredError') {
            throw{
                name: 'TokenExpiredError',
                message: 'Token expired'
            }
        }else if (error.name === 'JsonWebTokenError'){
            throw{
                name: 'JsonWebTokenError',
                message: 'Invalid token'
            }
        }        
        return
    }
}

module.exports = { tokenSign, tokenVerify };