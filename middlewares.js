const { rule, shield } = require("graphql-shield");

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return Boolean(ctx.userId);
});

const permissions = shield({
  Query: { secret: isAuthenticated }
});

module.exports = [permissions];
