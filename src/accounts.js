const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    me: User
  }
  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`;

const users = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@xxx" },
];

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
  },
  User: {
    __resolveReference(object) {
      return users.find((user) => user.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
