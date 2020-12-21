import "reflect-metadata";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
const { SESSION_SECRET } = require('./config/config');
import { redis } from './redis';
import express from 'express';
import connectRedis from 'connect-redis';
import session from "express-session";
import cors from "cors";
const { ApolloServer } = require('apollo-server-express');

import { UserResolver } from './resolvers/user/UserResolver';

//!In order to connect to DB - had to:
//* Execute the following query in MYSQL Workbench
//* ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
//* Where root as your user localhost as your URL and password as your password
//* Then run this query to refresh privileges:
//* flush privileges;
//* Try connecting using node after you do so.
//* If that doesn't work, try it without @'localhost' part. 

const main = async () => {
  //* calls the createConnection which connects to the database that you set up in the ormconfig.env file
  await createConnection().then(() => {
    console.log("Database Connected!");
  }).catch(error => console.log(error));

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  //* Sets up the ApolloServer which you use GraphQL with in order to view your queries and mutations easier
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req })
  });

  //* creates a constant called app which is really just an express server
  const app = express();
  const RedisStore = connectRedis(session);

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      resave: false,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      cookie: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 //7 years
      }
    })
  )

  //* takes the const server that is really just the instance of ApolloServer and applies a middleware of the app server
  //* this allows the ApolloServer to react with the express server which is connected to the db, allowing the ApolloServer to connect to the db
  server.applyMiddleware({ app, });

  //* express server is listening and working off of the port 4000 in this case
  //* the server.graphqlPath is the extension you would enter if you want to access the graphQL playground to work with queries and mutations
  app.listen(4000, () => {
    console.log(`Server is located at http://localhost:4000/graphql`);
  });
}

//* calls the functions main which runs this entire process. 
main();



