const { GraphQLServerLambda } = require("graphql-yoga");
const jwt = require("jsonwebtoken");
const middlewares = require("./middlewares");

const users = [
  { id: 1, name: "John Doe", email: "johndoe@gmail.com" },
  { id: 2, name: "Jane Doe", email: "janedeo@gmail.com" }
];

const typeDefs = `
  type Query {
    login(email: String!): String!
    secret: String!
  }
`;

const resolvers = {
  Query: {
    login: (_, { email }) => {
      const user = users.find(user => user.email === email);
      if (!user) throw new Error("User not found!");
      const token = jwt.sign({ id: user.id }, "your secret key");
      return token;
    },
    secret: () => "Secret data"
  }
};

const lambda = new GraphQLServerLambda({
  typeDefs,
  resolvers,
  middlewares: middlewares,
  context: req => {
    const token = req.event.headers.authorization;
    if (token) {
      const { id } = jwt.verify(token, "your secret key");
      return { ...req, userId: id };
    } else {
      return { ...req };
    }
  }
});

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;
