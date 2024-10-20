const {UsersModel} = require("../models.sequelize");
const config = require("../config");

module.exports = async (user_id, ref_code, amount) => {
    const refUser = await UsersModel.findOne({
        where: {ref_code: ref_code}
    })
    if (!refUser) return
    const earnUser = await UsersModel.findOne({
        where: {id: user_id}
    })
    if (!earnUser) return
    const refAmount = Math.round((Number(amount) / 100) * config.SITE.BAND.PERCENT_NOTES);
    const newRefAvailable = Number(refUser.ref_available) + refAmount;
    await refUser.update({
        ref_available: newRefAvailable
    })
    const newRefEarned = Number(earnUser.ref_earned) + refAmount;
    await earnUser.update({
        ref_earned: newRefEarned
    })
}