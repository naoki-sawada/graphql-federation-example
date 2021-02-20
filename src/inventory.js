const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Product @key(fields: "upc") {
    upc: String! @external
    weight: Int @external
    price: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
`;

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true },
  { upc: "4", inStock: true },
  { upc: "5", inStock: true },
];

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find((product) => product.upc === object.upc),
      };
    },
    shippingEstimate(object) {
      if (object.price > 1000) return 0;
      return object.weight * 0.5;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4004).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
