const fetch = require('node-fetch') 
const setCookie = require('set-cookie-parser');

const customFetch = async (url, headers = {}) => {
    // request to the root page to get cookies
    const res = await fetch("https://zingmp3.vn") 
    const extractedCookies = setCookie.parse(res.headers.raw()['set-cookie'], {
        decodeValues: true  // default: true
    });
    
    const neededCookies = ['zmp3_userid_random', 'zmp3_app_version_lagecy', 'zmp3_rqid_lagecy']
    
    const requestCookies = extractedCookies.filter(cookie => neededCookies.includes(cookie.name)).map(
        cookie => `${cookie.name}=${cookie.value}`
    ).join("; ")

    return await fetch(url, { headers: {
        ...headers, 
        'Cookie': requestCookies
    }})
}

module.exports = customFetch
