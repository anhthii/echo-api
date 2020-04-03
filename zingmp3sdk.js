const querystring = require("querystring");
const crypto = require("crypto");

const ZING_MP3_ENDPOINT = "https://zingmp3.vn/api";

const SECRET = "10a01dcf33762d3a204cb96429918ff6";
const API_KEY = "38e8643fb0dc04e8d65b99994d3dafff";

// composeParamsMessage used for generating for signature
const composeParamsMessage = paramStr => {
  const urlParams = new URLSearchParams(paramStr);
  // sort params by key
  const sortedUrlParamKeys = Array.from(urlParams.keys())
    .filter(key => key == "ctime" || key == "id")
    .sort();

  return sortedUrlParamKeys.map(key => `${key}=${urlParams.get(key)}`).join("");
};

const computeSignature = (paramStr, resourcePath) => {
  const paramsMessagae = composeParamsMessage(paramStr);
  const hash = crypto
    .createHash("sha256")
    .update(paramsMessagae)
    .digest("hex");

  const hmac = crypto.createHmac("sha512", SECRET);
  const signature = hmac.update(resourcePath + hash).digest("hex");
  return signature;
};

const ctime = () => {
  return String(Math.floor(new Date() / 1000));
};

// compose an api url with computed signature
const composeZingMp3URL = (resourcePath, paramObject) => {
  let paramStr = querystring.stringify(paramObject);
  const signature = computeSignature(paramStr, resourcePath);
  const params = { ...paramObject, sig: signature, api_key: API_KEY };

  paramStr = querystring.stringify(params);
  const url = ZING_MP3_ENDPOINT + resourcePath + "?" + paramStr;
  return url;
};

module.exports = {
  ctime,
  composeZingMp3URL,
  composeParamsMessage,
  computeSignature
};
