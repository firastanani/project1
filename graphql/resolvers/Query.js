const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../../models/user');

module.exports = {
    Query: {
        login: async function (parent, data , ctx, info) {

            const { error } = validate(data);
            if (error) {
                const errors = new Error("invalid input");
                errors.data = error.details[0].message;
                errors.code = 400;
                throw errors;
            }
             
            let user = await User.findOne({ email: data.email });
            if (!user) {
                const errors = new Error("invalid input");
                errors.data = "email not found"
                errors.code = 400;
                throw errors;
            }
    
            const validPassword = await bcrypt.compare(data.password, user.password);
            if (!validPassword) {
                throw new Error("Invalid password.");
            }
    
            const token = user.generateAuthToken();

            return {token: token , user: user};
        }
    } 
}

function validate(userInput) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email({tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.object(schema).validate(userInput);
}