const graphql = require("graphql");
const {authorizeUser} = require("../middlewares.graphql");
const {TasksModel, TasksHistoryModel, UsersModel} = require("../models.sequelize");
const telegramBot = require("../memory/telegram.bot")
const sendRefPercent = require("../functions/sendRefPercent");

const { GraphQLID, GraphQLInt, GraphQLObjectType } = graphql;

const ClaimTasksType = new GraphQLObjectType({
    name: "ClaimTasks",
    fields: () => ({
        balance: { type: GraphQLInt },
        amount: { type: GraphQLInt },
    }),
});

module.exports = {
    type: ClaimTasksType,
    args: {
        tasks_id: { type: GraphQLID }
    },
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const taskId = args.tasks_id;
            if (!taskId) {
                throw new Error("Request error")
            }
            const task = await TasksModel.findOne({
                where: {
                    status: 1,
                    id: taskId
                }
            })
            if (!task) {
                throw new Error("Selected task not found")
            }
            const isClaim = await TasksHistoryModel.count({
                where: {
                    tasks_id: task.id,
                    user_id: info.user.id,
                }
            })
            if (isClaim > 0) {
                throw new Error("You already received notes for this task")
            }
            const taskInfo = task.info;
            if (taskInfo.type === "telegram-subscribe") {
                const isSubscribe = await telegramBot.checker.session.getChatMember(taskInfo.telegram_channel_id, info.user.telegram_id).catch(err => err)
                if (
                    !isSubscribe.user ||
                    isSubscribe.status === "left" ||
                    isSubscribe.status === "kicked" ||
                    isSubscribe.status === "restricted"
                ) {
                    throw new Error("You have not subscribed to the Telegram channel")
                }
            } else if (taskInfo.type === "telegram-boost") {
                const isBoost = await telegramBot.checker.session.getUserChatBoosts(taskInfo.telegram_channel_id, info.user.telegram_id).catch(err => err)
                if (
                    !isBoost.boosts ||
                    !isBoost.boosts.length
                ) {
                    throw new Error("You haven't boosted the Telegram channel yet")
                }
            } else if (taskInfo.type === "balance") {
                if (info.user.balance < taskInfo.amount) {
                    throw new Error("Your current balance is less than " + taskInfo.amount + " notes")
                }
            } else if (taskInfo.type === "band") {
                const totalReferrals = await UsersModel.count({
                    where: {
                        ref_used: info.user.ref_code
                    }
                })
                if (totalReferrals < taskInfo.amount) {
                    const needCount = taskInfo.amount - totalReferrals
                    throw new Error("You do not need to invite " + needCount + " more friends to complete this task")
                }
            }
            await TasksHistoryModel.create({
                user_id: info.user.id,
                tasks_id: task.id,
                amount: task.reward
            })
            const newBalance = Number(info.user.balance) + task.reward;
            await info.user.update({ balance: newBalance });
            if (info.user.ref_used) {
                await sendRefPercent(info.user.id, info.user.ref_used, task.reward);
            }
            return {
                balance: info.user.balance,
                amount: task.reward
            }
        }
    )
};
