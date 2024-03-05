const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express'); // Import the apollo server
const { typeDefs, resolvers } = require('./schemas'); // Import typeDefs and resolvers
const db = require('./config/connection'); 
const { authMiddleware } = require('./utils/auth'); 
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
}); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

// Apply the Apollo server middleware to the express app
server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log('Now listening on localhost:${PORT}');
    // Log the URL where we can test our GQL API
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

// Serve up static assets
app/get('*', ( req, res ) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
