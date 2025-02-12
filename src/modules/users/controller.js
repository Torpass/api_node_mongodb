const UserDto = require('./dto');
const UserDao = require('./dao');

class UserController{
    static ping = async (request, response) => {
        response.status(200).json({
            message: 'pong'
        });
    }

    static register = async (request, response) => {

        const [errorsDto, createUserDto] = UserDto.register(request.body)
        if (errorsDto) return response.status(400).json({Errors: errorsDto});

        const [errorsDao, userData] = await UserDao.createUser(createUserDto);
        if (errorsDao) return response.status(400).json({Errors: errorsDao});


        response.status(200).send({
            message: 'User created',
            User: userData
        });
    }

    static login = async (request, response) => {
        const [errorsDto, loginUserDto] = UserDto.login(request.body)
        if (errorsDto) return response.status(400).json({Errors: errorsDto});

        const [errorsDao, userData] = await UserDao.login(loginUserDto);
        if (errorsDao) return response.status(400).json({Errors: errorsDao});

        response.status(200).send({
            message: 'User logged in',
            data: userData
        });
    }


    static getUsers = async (request, response) => {
        const data = await UserDao.getAllusers(); 
        response.status(200).send(data);
    }
    
}

module.exports = {UserController} 