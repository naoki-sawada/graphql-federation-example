const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Product @key(fields: "upc") {
    upc: String!
    name: String!
    price: Int
    weight: Int
  }
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }
`;

const products = [
  {
    upc: "1",
    name: "A",
    price: 2200,
    weight: 1000,
  },
  {
    upc: "2",
    name: "B",
    price: 200,
    weight: 1100,
  },
  {
    upc: "3",
    name: "C",
    price: 210,
    weight: 2000,
  },
  {
    upc: "4",
    name: "D",
    price: 110,
    weight: 500,
  },
  {
    upc: "5",
    name: "E",
    price: 400,
    weight: 10,
  },
];

const resolvers = {
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
  },
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.upc === object.upc);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
