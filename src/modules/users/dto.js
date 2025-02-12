class UserDTO {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static register(props) {
        const {name, email, password} = props;
        const errors = [];

        // Validar el nombre
        if(!name){
            errors.push('User name is required');
        }
        if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 30) {
            errors.push('El nombre debe ser un texto entre 3 y 30 caracteres.');
        }

        // Validar el email
        if(!email){
            errors.push('Email is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            errors.push('El email debe ser un email válido.');
        }

        // Validar la contraseña
        if(!password){
            errors.push('Pasword is required');
        }
        if (typeof password !== 'string' || password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        }

        if(errors.length > 0){
            return errors;
        }

        return [undefined, new UserDTO(name, email, password)]
    }

    static login(props) {
        const {email, password} = props;
        const errors = [];

        // Validar el email
        if(!email){
            errors.push('Email name is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            errors.push('El email debe ser un email válido.');
        }

        // Validar la contraseña
        if(!password){
            errors.push('Pasword is required');
        }
        if (typeof password !== 'string' || password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        }

        if(errors.length > 0){
            return errors;
        }

        return [undefined, new UserDTO(undefined, email, password)]
    }
}

module.exports = UserDTO;