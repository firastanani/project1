const { ApolloServer} = require('apollo-server-express');

const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');


const _ = require('lodash');

const MutationResolver = require('../graphql/resolvers/Mutation');
const QueryResolver = require('../graphql/resolvers/Query');


const resolvers = _.merge(MutationResolver , QueryResolver);

const typesArray = loadFilesSync(path.join(__dirname, '../graphql/schemas'), { extensions: ['graphql'] });
const typeDefs = mergeTypeDefs(typesArray);


module.exports = function (app) {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err)=> {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occured.!';
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        }
    });
  
    server.applyMiddleware({ app });

}