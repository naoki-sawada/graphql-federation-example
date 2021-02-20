const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    reviews: [Review]
  }
  type Review {
    id: ID!
    body: String
    author: User
    product: Product
  }
  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }
  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
  }
`;

const reviews = [
  {
    id: "1",
    authorID: "1",
    body: "huahugahugahuga",
    product: { upc: "1" },
  },
  {
    id: "2",
    authorID: "1",
    body: "aaaaaaaaa",
    product: { upc: "3" },
  },
  {
    id: "3",
    authorID: "2",
    body: "Cool.",
    product: { upc: "5" },
  },
];

const resolvers = {
  Query: {
    reviews(_, args) {
      return reviews;
    },
  },
  Review: {
    author(review) {
      return { __typename: "User", id: review.authorID };
    },
  },
  User: {
    reviews(user) {
      return reviews.filter((review) => review.authorID === user.id);
    },
  },
  Product: {
    reviews(product) {
      return reviews.filter((review) => review.product.upc === product.upc);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4003).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
