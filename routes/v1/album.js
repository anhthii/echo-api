const zingmp3sdk = require("../../zingmp3sdk");
const zingmp3Paths = require("../../zingmp3path");
const fetch = require("../../utils/fetch");

module.exports = (fastify, opts, done) => {
  const getAlias = (str) => {
    const regexp = /album\/(.+)\//;
    const matches = regexp.exec(str);
    return matches[1];
  };

  fastify.get("/album/default", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.albumDefault, {
      ctime: zingmp3sdk.ctime(),
    });
    const res = await fetch(zingMp3URL);
    const json = await res.json();
    if (!json.data) {
      return json;
    }

    return {
      result: true,
      origins: json.data.map((genre) => ({
        title: genre.genre.name,
        id: genre.genre.id,
        artists: genre.album.items.map((item) => ({
          cover: item.thumbnail_medium,
          title: item.title,
          id: item.id,
          alias: getAlias(item.link),
          name: item.name,
          artists: item.artists,
        })),
      })),
    };
  });

  fastify.get("/album/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.albumGenre, {
      id: request.params.id,
      type: "genre_album",
      sort: "listen",
      start: 0,
      count: 50,
      ctime: zingmp3sdk.ctime(),
    });
    const res = await fetch(zingMp3URL);
    const json = await res.json();
    if (!json.data) {
      return json;
    }

    return {
      numberOfPages: 1,
      albums: json.data.items.map((item) => ({
        cover: item.thumbnail_medium,
        title: item.title,
        id: item.id,
        alias: getAlias(item.link),
        artists: item.artists,
      })),
    };
  });
};
