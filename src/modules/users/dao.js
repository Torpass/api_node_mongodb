const { encryptPassword, comparePassword } = require('../../utils/HashPasswords');
const {tokenSign} = require('../../utils/Jwt');
const UserModel = require('./model');


class UserDao {

    static async createUser(userData) {
        try {
            const errors = [];

            // Verificar si ya existe un usuario con el email proporcionado
            const userExists = await UserModel.findOne({ email: userData.email });
            if (userExists) {
                errors.push('Email already exists');
            }

            // Encriptar la contraseña
            const passwordHash = await encryptPassword(userData.password);
            userData.password = passwordHash;

            // Crear el token
            const jwtToken = await tokenSign(userData);
            
            if(errors.length > 0){
                return errors;
            }
            
            const data = await UserModel.create(userData);

            return [undefined, {User:{
                data,
                token: jwtToken
            }}]

        } catch (error) {
            throw error;
        }
    }

    static async getAllusers() {
        try {
            const data = await UserModel.find();
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async login(userData){
        try {
            const errors = [];
            // Verificar si ya existe un usuario con el email proporcionado
            const userExists = await UserModel.findOne({ email: userData.email });
            if (!userExists) {
                errors.push('User not found');
                return errors;
            }

            // Verificar la contraseña
            const passwordMatch = await comparePassword(userData.password, userExists.password);
            if (!passwordMatch) {
                errors.push('Incorrect password');
                return errors;
            }

            // Crear el token
            const jwtToken = await tokenSign(userExists);


            return [undefined, {
                User: userExists,
                token: jwtToken
            }];

        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDao;