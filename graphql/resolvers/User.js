
const { Post } = require('../../models/post');

module.exports = {
    User: {
        posts: async function (parent, data , ctx, info) {
            const posts = Post.find({author: parent._id}).sort({date: -1});
            return posts;
        }
    } 
}
