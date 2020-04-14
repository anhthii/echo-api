module.exports = (fastify, opts, done) => {
  require("./artist")(fastify);
  require("./chart")(fastify);
  require("./album")(fastify);
  require("./song")(fastify);
  done();
};
