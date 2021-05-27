const _ = require("lodash");

const { User , validateUser} = require('../../models/user');

const { Post , validatePost} = require('../../models/post');

module.exports = {
    Mutation: {
        createUser: async function (parent, {data} , ctx, info) {

            const {error} = validateUser(data);
            if(error){
                const errors = new Error("invalid input");
                errors.data = error.details[0].message;
                errors.code = 400;
                throw errors;
            }
    
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                const errors = new Error("User already exist");
                errors.code = 400;
                throw errors;
            }
    
            let user = new User(_.pick(data, ["name", "email", "password",]));
    
            user = await user.save();
    
            const token = user.generateAuthToken();
    
            return { token: token, user: user };
        },
        createPost: async function (parent, {data} , ctx, info) {

            if(!ctx.isAuth){
                const errors = new Error("Authentication falild");
                error.code = 401;
                throw errors;
            }

            const {error} = validatePost(data);
            if(error){
                const errors = new Error("invalid input");
                errors.data = error.details[0].message;
                errors.code = 400;
                throw errors;
            }

            let post = new Post(_.pick(data , ['title' , 'description' , 'author']));

            post = await post.save();
    
            return { _id: post._id , title: post.title , description: post.description  , author: ctx.user };
        }
    }   
}
