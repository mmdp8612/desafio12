import User from "./models/User.js";
import bcrypt from 'bcrypt'

export class UserMongo {
    
    constructor(){

    }

    async login(email, password){
        try {
            if(email==="" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const userFound = await User.findOne({email});
            if(!userFound){
                throw new Error(`User ${email} Not Found!`);
            }

            if(!bcrypt.compareSync(password, userFound.password)){
                throw new Error(`Password incorrect!`);
            }            
            return userFound;
        } catch (error) {
            throw new Error(error);
        }
    }

    async register(first_name, last_name, email, age, password){

        try {
            if(first_name === "" || last_name === "" || email === "" || age === "" || password === ""){
                throw new Error(`All fields are required`);
            }
            
            const existsUser = await User.findOne({email});
            if(existsUser){
                throw new Error(`User ${email} duplicate!`);
            }

            const data = {
                first_name,
                last_name, 
                email, 
                age,
                password
            }
            
            data.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

            const user = new User(data);
            await user.save();
            return user;
        } catch (error) {
            throw new Error(error);
        }   
    }

    async findUserById(id){
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updatePassword(email, newPassword){
        try {
            const user = await User.findOne({email});
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const passwordMatch = await bcrypt.compare(newPassword, user.password);
            if (!passwordMatch) {
                throw new Error('La contraseña nueva debe ser diferente a la actual.');
            }

            const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            user.password = hashedPassword;
            await user.save();
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
}