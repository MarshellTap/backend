const CryptoJS = require("crypto-js");
const config = require("../config");

module.exports = (data) => {
    if (!data) {
        throw new Error("Wrong request data");
    }
    const initData = new URLSearchParams(data);
    const hash = initData.get("hash");
    let dataToCheck = [];
    initData.sort();
    initData.forEach(
        (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`),
    );
    const secret = CryptoJS.HmacSHA256(config.BOT_TOKEN, "WebAppData");
    const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(
        CryptoJS.enc.Hex,
    );
    if (_hash !== hash) {
        throw new Error("Auth error");
    }
    return initData;
}