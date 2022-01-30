const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const PORT = process.env.PORT || 5000;

//create server:
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

//connecting to DB and start server
mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log(`MongoDB is connected`)
        return server.listen({port: PORT})
    })
    .then((res) => {
        console.log(`Server is running at ${res.url}`)
    })
    .catch(err => {
        console.error(err)
    })

    




    

