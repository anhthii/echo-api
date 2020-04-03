const RESOURCE_PATHS = {
  chart: "/chart/get-chart",
  artist: "/artist/get-detail",
  artistType: {
    default: "/genre/get-artist-home",
    genre: "/artist/get-list"
  },
  albumDefault: "/genre/get-album-home",
  albumGenre: "/playlist/get-list",
  search: "/search/multi",
  tracks: "/playlist/get-playlist-detail",
  streaming: "/song/get-streamings",
  recommend: "/recommend",
  song: "/song/get-song-info"
};

module.exports = RESOURCE_PATHS;
