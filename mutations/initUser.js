const graphql = require("graphql");
const checkWebInitData = require('../functions/checkWebInitData')
const { UsersModel } = require("../models.sequelize");
const {socketIoUsers} = require("../memory/socketIoUsers");
const generateRandomString = require("../helpers/generateRandomString");
const availableDailyRewards = require("../helpers/availableDailyRewards");
const {guestRequest} = require("../middlewares.graphql");

const { GraphQLBoolean, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLObjectType } = graphql;

const kickOtherDevice = (oldAuthToken) => {
    const userIndexByOldAuthToken = socketIoUsers.findIndex(
        (user) => user.token === oldAuthToken,
    );
    if (userIndexByOldAuthToken !== -1) {
        const _OldSocket = socketIoUsers[userIndexByOldAuthToken].socket;
        _OldSocket.emit("game_error", {
            error: true,
            connection_type: "auth",
            is_multi: true,
            title: "You're already logged in from another device",
            description:
                "Unfortunately in our app you can only sit for 1 account from 1 device at a time",
            button: { type: "fail", name: "Exit from app", function: "closeApp" },
        });
        _OldSocket.disconnect();
    }
}

const UserBandType = new GraphQLObjectType({
    name: "UserBand",
    fields: () => ({
        code: { type: GraphQLString },
        available: { type: GraphQLInt },
    }),
});

const AvailableDailyRewardsType = new GraphQLObjectType({
    name: "AvailableDailyRewards",
    fields: () => ({
        status: { type: GraphQLBoolean },
        amount: { type: GraphQLInt },
    }),
});

const InitUserType = new GraphQLObjectType({
    name: "InitUser",
    fields: () => ({
        telegram_id: { type: GraphQLFloat },
        avatar: { type: GraphQLString },
        name: { type: GraphQLString },
        bandName: { type: GraphQLString },
        balance: { type: GraphQLInt },
        band: { type: UserBandType },
        token: { type: GraphQLString },
        available_daily_rewards: { type: AvailableDailyRewardsType },
    }),
});

module.exports = {
    type: InitUserType,
    args: {
        initData: { type: GraphQLString }
    },
    resolve: guestRequest(
        async (parent, args) => {
            const initData = checkWebInitData(args.initData);
            const userInfo = JSON.parse(initData.get("user"));
            const dbUser = await UsersModel.findOne({
                where: {telegram_id: userInfo.id},
            });
            if (!dbUser) {
                throw new Error("You're not registered");
            }
            const authToken = generateRandomString(96);
            kickOtherDevice(dbUser.auth_token);
            const dailyRewards = await availableDailyRewards(dbUser.id)
            await dbUser.update({auth_token: authToken});
            return {
                telegram_id: dbUser.telegram_id,
                avatar: dbUser.avatar,
                name: dbUser.name,
                bandName: dbUser.bandname,
                balance: dbUser.balance,
                band: {
                    code: dbUser.ref_code,
                    available: dbUser.ref_available,
                },
                token: dbUser.auth_token,
                available_daily_rewards: dailyRewards
            }
        }
    )
};
