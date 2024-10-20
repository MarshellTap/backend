module.exports = (base64String) => {
    const regex = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    return regex.test(base64String);
}