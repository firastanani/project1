const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Post } = require('../../models/post');

const { User } = require('../../models/user');

module.exports = {
    Query: {
        login: async function (parent, data , ctx, info) {

            console.log(data);

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
        },
        getMe: function (parent, data , ctx, info) {

            if (!ctx.isAuth) {
                const errors = new Error("Authentication falild");
                errors.code = 401;
                throw errors;
            }
            return ctx.user;
        },
        posts: async function(parent , data , ctx , info){
            const userId = ctx.user._id;
            const posts = await Post.find({author: userId});
            return posts;
        },
        hello: function(parent , data , ctx , info){
            return 'hello';
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