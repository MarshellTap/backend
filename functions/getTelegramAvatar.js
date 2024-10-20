const Telegram = require("../memory/telegram.bot")
const axios = require("axios");

module.exports = async (telegram_user_id) => {
    const avatars = await Telegram.session.getUserProfilePhotos(telegram_user_id);
    if (!avatars || !avatars.total_count || !avatars.photos || !avatars.photos.length) return
    const first_photo = avatars.photos[0][0];
    const get_file_data = await Telegram.session.getFileLink(first_photo.file_id)
    if (!get_file_data || !get_file_data.pathname || !get_file_data.href) return
    const get_href_data = await axios.get(get_file_data.href, {responseType: 'arraybuffer'})
        .then(response => Buffer.from(response.data, 'binary').toString('base64'));
    if (!get_href_data || !/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(get_href_data)) return;
    return {
        without_data: get_href_data,
        with_data: "data:image/png;base64," + get_href_data
    };
}