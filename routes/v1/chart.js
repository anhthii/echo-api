const zingmp3sdk = require("../../zingmp3sdk");
const zingmp3Paths = require("../../zingmp3path");
const fetch = require("../../utils/fetch");

module.exports = (fastify, opts, done) => {
  fastify.get("/chart/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.chart, {
      id: request.params.id,
      ctime: zingmp3sdk.ctime(),
    });
    const res = await fetch(zingMp3URL);
    const json = await res.json();
    if (!json.data) {
      return json;
    }

    return {
      msg: "Success",
      data: {
        cover: json.data.info.banner,
        items: json.data.items,
      },
    };
  });
};
