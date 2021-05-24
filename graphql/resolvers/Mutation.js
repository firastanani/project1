const _ = require("lodash");

const { User , validate} = require('../../models/user');

module.exports = {
    Mutation: {
        createUser: async function (parent, {userInput} , ctx, info) {
            
            const {error} = validate(userInput);
            if(error){
                const errors = new Error("invalid input");
                errors.data = error.details[0].message;
                errors.code = 400;
                throw errors;
            }
    
            const existingUser = await User.findOne({ email: userInput.email });
            if (existingUser) {
                const errors = new Error("User already exist");
                errors.code = 400;
                throw errors;
            }
    
            let user = new User(_.pick(userInput, ["name", "email", "password",]));
    
            user = await user.save();
    
            const token = user.generateAuthToken();
    
            return { token: token, user: user };
        },
    }   
}