const graphql = require("graphql");
const checkWebInitData = require('../functions/checkWebInitData')
const { UsersModel } = require("../models.sequelize");
const getTelegramAvatar = require("../functions/getTelegramAvatar")
const generateRandomString = require("../helpers/generateRandomString");
const defaultAvatar = require('../helpers/defaultAvatar')
const {guestRequest} = require("../middlewares.graphql");

const { GraphQLBoolean, GraphQLString, GraphQLObjectType } = graphql;

const InitGameType = new GraphQLObjectType({
    name: "InitGame",
    fields: () => ({
        is_register: { type: GraphQLBoolean },
        name: { type: GraphQLString },
        avatar: { type: GraphQLString },
        default_avatar: { type: GraphQLString },
        temporary_auth_token: { type: GraphQLString },
    }),
});

module.exports = {
    type: InitGameType,
    args: {
        initData: { type: GraphQLString },
    },
    resolve: guestRequest(
        async (parent, args) => {
            const initData = checkWebInitData(args.initData);
            const userInfo = JSON.parse(initData.get("user"));
            const dbIsRegisterUser = await UsersModel.count({
                where: { telegram_id: userInfo.id },
            });
            const isRegister = dbIsRegisterUser > 0;
            const response = {
                is_register: isRegister,
                default_avatar: defaultAvatar.src,
            };
            if (!isRegister) {
                const temporaryAuthToken = userInfo.id + ":" + generateRandomString(96);
                const telegramAvatar = await getTelegramAvatar(userInfo.id)
                response.name = userInfo.first_name;
                response.avatar = !telegramAvatar ? defaultAvatar.src : telegramAvatar.with_data;
                response.temporary_auth_token = temporaryAuthToken;
            }
            return response;
        }
    )
};
