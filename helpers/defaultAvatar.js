const config = require("../config");

const DEFAULT_AVATAR = config.CLOUDFLARE.R2.BUCKETS.AVATARS.DOMAIN + config.CLOUDFLARE.R2.BUCKETS.AVATARS.DEFAULT_AVATAR_URI;

module.exports = {
    src: DEFAULT_AVATAR,
    isDefault: (src) => src === DEFAULT_AVATAR
}