const zingmp3sdk = require("../../zingmp3sdk");
const zingmp3Paths = require("../../zingmp3path");
const _pick = require("lodash.pick");
const fetch = require("../../utils/fetch");
const iplocation = require("iplocation").default;
const { isEmpty } = require("../../utils/objectUtil");

const getArtistAlias = (str) => {
  return str.substring(str.lastIndexOf("/") + 1);
};

module.exports = (fastify, opts, done) => {
  // search a song by term
  fastify.get("/search", async (request, reply) => {
    const term = request.query.term;
    console.log(term);
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.search, {
      q: term,
      ctime: zingmp3sdk.ctime(),
    });

    const res = await fetch(zingMp3URL);
    const json = await res.json();
    if (!json.data) {
      return json;
    }
    return {
      result: true,
      data: {
        artist: !isEmpty(json.data.artist)
          ? json.data.artist.items.map((item) => ({
            thumbnail: item.thumbnail,
            alias: getArtistAlias(item.link),
            name: item.name,
          }))
          : [],
        song: !isEmpty(json.data.song)
          ? json.data.song.items.map((item) => ({
            id: item.id,
            title: item.title,
            alias: item.alias,
            artists_names: item.artists_names,
            streaming_status: item.streaming_status,
          }))
          : [],
      },
    };
  });

  // search top 100 popular tracks by collection ID
  fastify.get("/tracks/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.tracks, {
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
        items: json.data.song.items.map((item) =>
          _pick(item, [
            "id",
            "name",
            "title",
            "artists",
            "artists_names",
            "thumbnail",
            "alias",
            "streaming_status",
          ])
        ),
      },
    };
  });

  // get streaming link for a song
  fastify.get("/streaming/:id", async (request, reply) => {
    const ipRes = await iplocation(request.ip);
    console.log("ipRes", ipRes);
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.streaming, {
      id: request.params.id,
      ctime: zingmp3sdk.ctime(),
    });
    const res = await fetch(zingMp3URL);
    const json = await res.json();
    return json;
  });

  // get song info by id
  fastify.get("/song/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.song, {
      id: request.params.id,
      ctime: zingmp3sdk.ctime(),
    });

    const res = await fetch(zingMp3URL);
    const json = await res.json();

    if (!json.data) {
      return json;
    }

    const data = json.data;
    return {
      data: {
        ...data,
        source: data.streaming.default,
        artist: data.artists[0],
        name: data.title,
      },
    };
  });

  // get recommended songs for the song
  fastify.get("/recommend/:id", async (request, reply) => {
    const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.recommend, {
      id: request.params.id,
      type: "playlist",
      count: 20,
      ctime: zingmp3sdk.ctime(),
    });

    const res = await fetch(zingMp3URL);
    const json = await res.json();
    return json;
  });
};
