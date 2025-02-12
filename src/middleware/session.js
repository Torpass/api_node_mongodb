import handleHttpErrors from '../utils/handleErrors';
import {tokenVerify} from '../utils/handleJwt';
const {tokenVerify} = require('../utils/Jwt');




const authMiddleware = async (req, res, next) =>{
    try{
        if(!req.headers.authorization){
            return handleHttpErrors(res, 'NEED_SESSION', 401);
        }

        let tokenAuth = req.headers.authorization;
        tokenAuth = tokenAuth?.split(' ').pop() || 'no token';

        const dataToken = await tokenVerify(tokenAuth);

        if(!dataToken){
            handleHttpErrors(res, 'NOT_PAYLOAD_DATA', 401);
        }
        
        console.log(dataToken);

    }catch(error){
        // if (error.name === 'TokenExpiredError') {
        //     return handleHttpErrors(res, 'SESSION_EXPIRED', 401);
        // } else if (error.name === 'JsonWebTokenError'){
        //     return handleHttpErrors(res, 'NOT_PAYLOAD_DATA', 403);
        // }else{
        //     console.log(error);
        //     return handleHttpErrors(res, 'ERROR_AUTH', 403);
        // }
        console.log(error);
    }
}

export {authMiddleware};