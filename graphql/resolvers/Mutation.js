const _ = require("lodash");

const { User, validateUser } = require("../../models/user");

const { Post, validatePost } = require("../../models/post");
const Joi = require("joi");
const e = require("express");

module.exports = {
  Mutation: {
    createUser: async function (parent, { data }, ctx, info) {
      console.log(data);
      const { error } = validateUser(data);
      if (error) {
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

      let user = new User(_.pick(data, ["name", "email", "password"]));

      user = await user.save();

      const token = user.generateAuthToken();

      return { token: token, user: user };
    },
    createPost: async function (parent, { data }, ctx, info) {
      console.log(data);
      if (!ctx.isAuth) {
        const errors = new Error("Authentication falild");
        errors.code = 401;
        throw errors;
      }

      const { error } = validatePost(data);
      if (error) {
        const errors = new Error("invalid input");
        errors.data = error.details[0].message;
        errors.code = 400;
        throw errors;
      }

      data.author = ctx.user._id;
      let post = new Post(data);
      post = await post.save();

      post.author = ctx.user;

      return post;
    },

    deletePost: async function (parent, { id }, ctx, info) {
      if (!ctx.isAuth) {
        const errors = new Error("Authentication falild");
        errors.code = 401;
        throw errors;
      }

      let post = await Post.findById(id);

      if (!post) {
        const errors = new Error("Post not found");
        errors.code = 404;
        throw errors;
      }

      if (!post.author.equals(ctx.user._id)) {
        const errors = new Error("can't remove others posts");
        errors.code = 401;
        throw errors;
      }

      post = await post.remove();

      post.author = ctx.user;

      return post;
    },
    updatePost: async function (parent, args, ctx, info) {
      if (!ctx.isAuth) {
        const errors = new Error("Authentication falild");
        errors.code = 401;
        throw errors;
      }

      const { id, data } = args;
      const { error } = validatePost(data);
      if (error) {
        const errors = new Error("invalid input");
        errors.data = error.details[0].message;
        errors.code = 400;
        throw errors;
      }

      const post = await Post.findOne({
        _id: id,
        author: ctx.user._id,
      });

      if (!post) {
        const errors = new Error("Post not found");
        errors.code = 404;
        throw errors;
      }

      post.title = data.title;
      post.description = data.description;

      if (typeof data.published === "boolean") {
        post.published = data.published;
      }

      return post;
    },
    logout: async function (parent, args, ctx, info) {
      if (!ctx.isAuth) {
        const errors = new Error("Authentication falild");
        errors.code = 401;
        throw errors;
      }
      ctx.user.tokens = ctx.user.tokens.filter((token) => {
        return ctx.token !== token;
      });
      const result = await ctx.user.save();
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    logoutAll: async function (parent, args, ctx, info) {
      if (!ctx.isAuth) {
        const errors = new Error("Authentication falild");
        errors.code = 401;
        throw errors;
      }
      ctx.user.tokens = [];
      const result = await ctx.user.save();
      if (result) {
        return true;
      } else {
        return false;
      }
    },
    test: function (parent , {data} , ctx , info) {
      return data.toString();
    }
  },
};
