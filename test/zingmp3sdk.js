tap = require("tap");
const zingmp3sdk = require("../zingmp3sdk");

tap.equal(
  zingmp3sdk.composeParamsMessage("ctime=1585741628&alias=The-Chainsmokers"),
  "ctime=1585741628"
);

tap.equal(
  zingmp3sdk.composeParamsMessage("id=ZWAFDUIF&ctime=1585747393"),
  "ctime=1585747393id=ZWAFDUIF"
);

tap.equal(
  zingmp3sdk.computeSignature(
    "alias=The-Chainsmokers&ctime=1585741628",
    "/artist/get-detail"
  ),
  "7753a90b0ce7e91b89afb727405a62956b2232d1e0ddb8ea4ba5154b03323172749744fd9e791beaf641da546cb4b2b95350d4c49d9a3bf7d6ed81031e149376"
);

tap.equal(
  zingmp3sdk.computeSignature(
    "id=ZWAFDUIF&ctime=1585747393",
    "/song/get-song-info"
  ),
  "4f04bad8af365bcb5593c754ce558c0baf99d0a1424ac7f98a34bef53ed507ee5269bb0f102378358a9950b8628372d88498829e044730dfa704f526b6e0eada"
);

tap.equal(
  zingmp3sdk.composeZingMp3URL("/song/get-song-info", {
    id: "ZWAFDUIF",
    ctime: "1585747393"
  }),
  "https://zingmp3.vn/api/song/get-song-info?id=ZWAFDUIF&ctime=1585747393&sig=4f04bad8af365bcb5593c754ce558c0baf99d0a1424ac7f98a34bef53ed507ee5269bb0f102378358a9950b8628372d88498829e044730dfa704f526b6e0eada&api_key=38e8643fb0dc04e8d65b99994d3dafff"
);

tap.equal(
  zingmp3sdk.composeZingMp3URL("/song/get-song-info", {
    id: "ZWAFDUIF",
    ctime: "1585747393"
  }),
  "https://zingmp3.vn/api/song/get-song-info?id=ZWAFDUIF&ctime=1585747393&sig=4f04bad8af365bcb5593c754ce558c0baf99d0a1424ac7f98a34bef53ed507ee5269bb0f102378358a9950b8628372d88498829e044730dfa704f526b6e0eada&api_key=38e8643fb0dc04e8d65b99994d3dafff"
);

tap.equal(
  zingmp3sdk.composeZingMp3URL("/artist/get-detail", {
    alias: "Shawn-Mendes",
    ctime: "1585748865"
  }),
  "https://zingmp3.vn/api/artist/get-detail?alias=Shawn-Mendes&ctime=1585748865&sig=453e1a5523fd479b00adc722019b478a919dbc0ce44915b9884ee684deb9ee8395ff2d6829b772c2ea1e9764dbb0b1130438e5ccb67ff3256831af6494d3e8d4&api_key=38e8643fb0dc04e8d65b99994d3dafff"
);

tap.equal(
  zingmp3sdk.composeZingMp3URL("/top100", {
    ctime: "1585749015"
  }),
  "https://zingmp3.vn/api/top100?ctime=1585749015&sig=08035be83fffd3bbb5aa6a4772f6044b62aab9f1d9ccc38d8d91ea10addb4516b3d392809fda7bb94b94abe77f68c4f52565536356a7fee944e0a75e743e4bed&api_key=38e8643fb0dc04e8d65b99994d3dafff"
);

// test get list
tap.equal(
  zingmp3sdk.composeZingMp3URL("/playlist/get-list", {
    id: "IWZ9Z088",
    type: "genre_album",
    sort: "listen",
    start: 0,
    count: 20,
    ctime: "1585749081"
  }),
  "https://zingmp3.vn/api/playlist/get-list?id=IWZ9Z088&type=genre_album&sort=listen&start=0&count=20&ctime=1585749081&sig=6f945ef49f63aedaa3873f965bbb3010993ca3dc99feec4e43ce18a1cfcf0e0017273c67498f97fbc4de8e4dbbe3ddfdd87913c1602fe06fbf81d0519779a9d7&api_key=38e8643fb0dc04e8d65b99994d3dafff"
);
