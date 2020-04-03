const fastify = require("fastify")({ logger: true });
const crypto = require("crypto");
const fetch = require("node-fetch");
const zingmp3sdk = require("./zingmp3sdk");
const zingmp3Paths = require("./zingmp3path");
const _pick = require("lodash.pick");

const iplocation = require("iplocation").default;
fastify.register(require("fastify-cors"), {
  // put your options here
});

fastify.get("/chart/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.chart, {
    id: request.params.id,
    ctime: zingmp3sdk.ctime()
  });
  const res = await fetch(zingMp3URL);
  const json = await res.json();

  return {
    msg: "Success",
    data: {
      cover: json.data.info.banner,
      items: json.data.items
    }
  };
});

fastify.get("/artist-genre/default", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(
    zingmp3Paths.artistType.default,
    {
      ctime: zingmp3sdk.ctime()
    }
  );
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  if (!json.data) {
    return json;
  }

  return {
    result: true,
    origins: json.data.map(genre => ({
      title: genre.genre.name,
      id: genre.genre.id,
      artists: genre.items.map(item => ({
        thumb: item.thumbnail,
        link: item.link,
        name: item.name
      }))
    }))
  };
});

fastify.get("/artist-genre/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(
    zingmp3Paths.artistType.genre,
    {
      id: request.params.id,
      type: "genre",
      sort: "listen",
      start: 0,
      count: 20,
      ctime: zingmp3sdk.ctime()
    }
  );
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  if (!json.data) {
    return json;
  }

  return {
    numberOfPages: 1,
    artists: json.data.items.map(item => ({
      thumb: item.thumbnail,
      link: item.link,
      name: item.name
    }))
  };
});

fastify.get("/artist/:alias/:type", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.artist, {
    alias: request.params.alias,
    ctime: zingmp3sdk.ctime()
  });
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  const type = request.params.type;
  switch (type) {
    case "albums":
      break;

    case "songs":
      return {
        avatar: json.data.thumbnail,
        cover: json.data.cover,
        songs: json.data.song.items.map(item => ({
          id: item.id,
          alias: item.alias,
          title: item.title,
          artist_text: item.artists_names
        })),
        numberOfPages: 1,
        artistName: json.data.name
      };

    case "biography":
      break;

    default:
      return {};
  }

  return json;
});

const getAlias = str => {
  const regexp = /album\/(.+)\//;
  const matches = regexp.exec(str);
  return matches[1];
};

const getArtistAlias = str => {
  return str.substring(str.lastIndexOf("/") + 1);
};

fastify.get("/album/default", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.albumDefault, {
    ctime: zingmp3sdk.ctime()
  });
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  if (!json.data) {
    return json;
  }

  return {
    result: true,
    origins: json.data.map(genre => ({
      title: genre.genre.name,
      id: genre.genre.id,
      artists: genre.album.items.map(item => ({
        cover: item.thumbnail_medium,
        title: item.title,
        id: item.id,
        alias: getAlias(item.link),
        name: item.name,
        artists: item.artists
      }))
    }))
  };
});

fastify.get("/album/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.albumGenre, {
    id: request.params.id,
    type: "genre_album",
    sort: "listen",
    start: 0,
    count: 50,
    ctime: zingmp3sdk.ctime()
  });
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  if (!json.data) {
    return json;
  }

  return {
    numberOfPages: 1,
    albums: json.data.items.map(item => ({
      cover: item.thumbnail_medium,
      title: item.title,
      id: item.id,
      alias: getAlias(item.link),
      artists: item.artists
    }))
  };
});

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}

fastify.get("/search", async (request, reply) => {
  const term = request.query.term;
  console.log(term);
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.search, {
    q: term,
    ctime: zingmp3sdk.ctime()
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
        ? json.data.artist.items.map(item => ({
            thumbnail: item.thumbnail,
            alias: getArtistAlias(item.link),
            name: item.name
          }))
        : [],
      song: !isEmpty(json.data.song)
        ? json.data.song.items.map(item => ({
            id: item.id,
            title: item.title,
            alias: item.alias,
            artists_names: item.artists_names,
            streaming_status: item.streaming_status
          }))
        : []
    }
  };
});
// S27GVAmyDDHSanyG
fastify.get("/tracks/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.tracks, {
    id: request.params.id,
    ctime: zingmp3sdk.ctime()
  });

  const res = await fetch(zingMp3URL);
  const json = await res.json();
  if (!json.data) {
    return json;
  }

  return {
    msg: "Success",
    data: {
      items: json.data.song.items.map(item =>
        _pick(item, [
          "id",
          "name",
          "title",
          "artists",
          "artists_names",
          "thumbnail",
          "alias",
          "streaming_status"
        ])
      )
    }
  };
});

fastify.get("/streaming/:id", async (request, reply) => {
  const ipRes = await iplocation(request.ip);
  console.log("ipRes", ipRes);
  const res = await fetch(zingMp3URL);
  const json = await res.json();
  return json;
});

fastify.get("/song/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.song, {
    id: request.params.id,
    ctime: zingmp3sdk.ctime()
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
      name: data.title
    }
  };
});

fastify.get("/recommend/:id", async (request, reply) => {
  const zingMp3URL = zingmp3sdk.composeZingMp3URL(zingmp3Paths.recommend, {
    id: request.params.id,
    type: "playlist",
    count: 20,
    ctime: zingmp3sdk.ctime()
  });

  const res = await fetch(zingMp3URL);
  const json = await res.json();
  return json;
});

const start = async () => {
  try {
    await fastify.listen(5000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
