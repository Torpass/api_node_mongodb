const handleHttpErrors = require('../utils/handleErrors');
const UserModel = require('../modules/users/model');
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

        const user = await UserModel.findOne(where = {email: dataToken.email});
        req.user = user;

        next();
    }catch(error){
        if (error.name === 'TokenExpiredError') {
            return handleHttpErrors(res, 'SESSION_EXPIRED', 401);
        } else if (error.name === 'JsonWebTokenError'){
            return handleHttpErrors(res, 'NOT_PAYLOAD_DATA', 403);
        }else{
            console.log(error);
            return handleHttpErrors(res, 'ERROR_AUTH', 403);
        }
    }
}

module.exports =  {authMiddleware};