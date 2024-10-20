const graphql = require("graphql");
const {authorizeUser} = require("../middlewares.graphql");
const availableDailyRewards = require("../helpers/availableDailyRewards");
const {DailyRewardsHistoryModel} = require("../models.sequelize");
const sendRefPercent = require("../functions/sendRefPercent");

const { GraphQLInt, GraphQLObjectType } = graphql;

const ClaimDailyRewardsType = new GraphQLObjectType({
    name: "ClaimDailyRewards",
    fields: () => ({
        amount: { type: GraphQLInt },
        balance: { type: GraphQLInt },
    }),
});

module.exports = {
    type: ClaimDailyRewardsType,
    args: {},
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const dailyRewards = await availableDailyRewards(info.user.id)
            if (!dailyRewards.status) {
                throw new Error("At this time, you do not have a daily bonus to receive")
            }
            const newBalance = Number(info.user.balance) + dailyRewards.amount;
            await DailyRewardsHistoryModel.create({
                user_id: info.user.id,
                amount: dailyRewards.amount
            })
            await info.user.update({ balance: newBalance });
            if (info.user.ref_used) {
                await sendRefPercent(info.user.id, info.user.ref_used, dailyRewards.amount);
            }
            return {
                amount: dailyRewards.amount,
                balance: info.user.balance
            }
        }
    )
};
