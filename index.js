const fastify = require("fastify")({ logger: true });

const metricsPlugin = require("fastify-metrics");
fastify.register(metricsPlugin, { endpoint: "/metrics" });

fastify.register(require("fastify-rate-limit"), {
  max: 20,
  timeWindow: "1 minute",
});

const apiV1 = require("./routes/v1");

const iplocation = require("iplocation").default;
fastify.register(require("fastify-cors"), {
  // put your options here
});

fastify.register(apiV1, { prefix: "/api/v1" });

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
