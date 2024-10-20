const {UsersModel} = require("../models.sequelize");

const MIN_BANDNAME_LENGTH = 5,
    MAX_BANDNAME_LENGTH = 14;

module.exports = async (bandName) => {
    if (bandName.length < MIN_BANDNAME_LENGTH) {
        throw new Error("Bandname cannot be less than " + MIN_BANDNAME_LENGTH + " characters long");
    }
    if (bandName.length > MAX_BANDNAME_LENGTH) {
        throw new Error("Bandname cannot be more than " + MAX_BANDNAME_LENGTH + " characters long");
    }
    if (/[^a-zA-Z0-9]/.test(bandName)) {
        throw new Error("Bandname must contain only English letters and numbers");
    }
    const dbReq = await UsersModel.count({
        where: {
            bandName: bandName
        }
    })
    if (dbReq > 0) {
        throw new Error("Bandname is already taken!");
    }
    return {
        available: true
    }
}