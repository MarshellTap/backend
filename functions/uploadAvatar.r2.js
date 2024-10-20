const cloudflareR2 = require("../memory/cloudflare.r2");
const generateRandomString = require("../helpers/generateRandomString");
const config = require("../config");

module.exports = async (base64String) => {
    const outputFormat = base64String.split(';')[0].split('/')[1];
    if (
        outputFormat !== 'png' &&
        outputFormat !== 'jpeg'
    ) return
    const fileName = generateRandomString(24) + '.' + outputFormat;
    const uploadResponse = await cloudflareR2.client.put(
        config.CLOUDFLARE.R2.BUCKETS.AVATARS.NAME,
        fileName,
        Buffer.from(base64String.split(',')[1], "base64"),
        'image/' + outputFormat
    );
    if (
        !uploadResponse.data ||
        !uploadResponse.data.success ||
        !uploadResponse.data.keyname
    ) return
    return config.CLOUDFLARE.R2.BUCKETS.AVATARS.DOMAIN + "/" + uploadResponse.data.keyname
}