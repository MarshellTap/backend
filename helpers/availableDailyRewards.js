const moment = require("moment-timezone");
const {DailyRewardsHistoryModel} = require("../models.sequelize");
const {Op, Sequelize} = require("sequelize");

const DEFAULT_DAILY_REWARDS_AMOUNT = 20;

module.exports = async (user_id) => {
    const currentUnix = moment().unix()
    const lastItem = await DailyRewardsHistoryModel.findOne({
        where: {
            user_id: user_id
        },
        order: [['id', 'DESC']],
    })
    if (!lastItem) return { status: true, amount: DEFAULT_DAILY_REWARDS_AMOUNT };
    const lastItemUnix = moment(lastItem.createdAt).unix();
    const ifDay = currentUnix - lastItemUnix;
    if (ifDay < 86400) return { status: false };
    const startOfWeekUnix = moment().startOf('isoWeek').unix();
    const lastClaimedDailyRewards = await DailyRewardsHistoryModel.findOne({
        where: {
            user_id: user_id,
            createdAt: {
                [Op.gte]: Sequelize.literal(`FROM_UNIXTIME(${startOfWeekUnix})`)
            },
        },
        order: [['id', 'DESC']],
    });
    if (!lastClaimedDailyRewards) return { status: true, amount: DEFAULT_DAILY_REWARDS_AMOUNT };
    const rewardAmount = lastClaimedDailyRewards.amount * 2;
    return { status: true, amount: rewardAmount };
}