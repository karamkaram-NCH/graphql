const { graphqlHTTP } = require("express-graphql");
const { graphqlSchema } = require("./schema");
const { graphqlResolver } = require("./resolvers");

const graphqlConfiguration = graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
});

module.exports = { graphqlConfiguration };
