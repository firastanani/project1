
const { Post } = require('../../models/post');
const { User } = require('../../models/user');

module.exports = {
    Post: {
        author: async function (parent, data , ctx, info) {
            const authorId = parent.author;
            const author = User.findById(authorId);
            return author;
        }
    } 
}
