const Joi = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");

const schemaPost = mongoose.Schema(
    {
        description: {
            type: String,
            require: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", schemaPost);

function validateUser(user) {
    const schema = {
        description: Joi.string().required(),
        owner: Joi.objectId().required(),
    }
    return Joi.object(schema).validate(user);
}

module.exports = Post;
