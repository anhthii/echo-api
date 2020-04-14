const zingmp3sdk = require("../../zingmp3sdk");
const zingmp3Paths = require("../../zingmp3path");
const fetch = require("node-fetch");

module.exports = (fastify, opts, done) => {
  fastify.get("/artist-genre/default", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(
      zingmp3Paths.artistType.default,
      {
        ctime: zingmp3sdk.ctime(),
      }
    );
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
        artists: genre.items.map((item) => ({
          thumb: item.thumbnail,
          link: item.link,
          name: item.name,
        })),
      })),
    };
  });

  // get all artists for a specific genre
  fastify.get("/artist-genre/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(
      zingmp3Paths.artistType.genre,
      {
        id: request.params.id,
        type: "genre",
        sort: "listen",
        start: 0,
        count: 20,
        ctime: zingmp3sdk.ctime(),
      }
    );
    const res = await fetch(zingMp3URL);
    const json = await res.json();
    if (!json.data) {
      return json;
    }

    return {
      numberOfPages: 1,
      artists: json.data.items.map((item) => ({
        thumb: item.thumbnail,
        link: item.link,
        name: item.name,
      })),
    };
  });

  // get songs of an artist with alias
  fastify.get("/artist/:alias", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.artist, {
      alias: request.params.alias,
      ctime: zingmp3sdk.ctime(),
    });
    const res = await fetch(zingMp3URL);
    const json = await res.json();

    return {
      avatar: json.data.thumbnail,
      cover: json.data.cover,
      songs: json.data.song.items.map((item) => ({
        id: item.id,
        alias: item.alias,
        title: item.title,
        artist_text: item.artists_names,
      })),
      numberOfPages: 1,
      artistName: json.data.name,
    };
  });
};
