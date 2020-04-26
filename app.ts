const { gql, ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");

const mongoose = require("mongoose");

const typeDefs = gql(importSchema("./graphql/schema.gql"));
const resolvers = require("./resolver");

require("dotenv").config(); // Configuring env variables

mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = new ApolloServer({ typeDefs, resolvers });
    server.listen({ port: process.env.PORT }).then((info: { port: number }) => {
      console.log(
        `🚀 Server is up and running at http://localhost:${info.port}`
      );
    });
  });
