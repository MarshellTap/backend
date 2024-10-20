const graphql = require("graphql");
const checkWebInitData = require('../functions/checkWebInitData')
const { UsersModel } = require("../models.sequelize");
const {guestRequest} = require("../middlewares.graphql");
const defaultAvatar = require('../helpers/defaultAvatar')
const isValidBase64Image = require("../functions/isValidBase64Image")
const generateRandomString = require("../helpers/generateRandomString");
const uploadAvatarR2 = require("../functions/uploadAvatar.r2");
const compressBase64Image = require("../functions/compressBase64Image");
const config = require("../config");

const MIN_BANDNAME_LENGTH = 5,
    MAX_BANDNAME_LENGTH = 14;

const { GraphQLBoolean, GraphQLString, GraphQLObjectType } = graphql;

const getAvatarUri = async (avatar) => {
    if (!defaultAvatar.isDefault(avatar)) {
        const compressImage = await compressBase64Image(avatar);
        const uploadR2 = await uploadAvatarR2(compressImage.with_data);
        if (!uploadR2) return defaultAvatar.src;
        return uploadR2;
    } else return defaultAvatar.src;
}

const CreateBandType = new GraphQLObjectType({
    name: "CreateBand",
    fields: () => ({
        success: { type: GraphQLBoolean },
    }),
});

module.exports = {
    type: CreateBandType,
    args: {
        initData: { type: GraphQLString },
        bandName: { type: GraphQLString },
        avatar: { type: GraphQLString },
        refCode: { type: GraphQLString },
    },
    resolve: guestRequest(
        async (parent, args) => {
            const initData = checkWebInitData(args.initData);
            const userInfo = JSON.parse(initData.get("user"));
            const dbIsRegisterUser = await UsersModel.count({
                where: { telegram_id: userInfo.id },
            });
            if (dbIsRegisterUser) {
                throw new Error("You've already formed your band");
            }
            const bandName = args.bandName,
                avatar = args.avatar,
                refCode = args.refCode;
            let refUsed = null;
            if (bandName.length < MIN_BANDNAME_LENGTH) {
                throw new Error("Bandname cannot be less than " + MIN_BANDNAME_LENGTH + " characters long");
            }
            if (bandName.length > MAX_BANDNAME_LENGTH) {
                throw new Error("Bandname cannot be more than " + MAX_BANDNAME_LENGTH + " characters long");
            }
            if (/[^a-zA-Z0-9]/.test(bandName)) {
                throw new Error("Bandname must contain only English letters and numbers");
            }
            if (!avatar) {
                throw new Error("You can't create a band without an avatar");
            }
            if (!defaultAvatar.isDefault(avatar) && !isValidBase64Image(avatar)) {
                throw new Error("Bandname must contain only English letters and numbers");
            }
            if (
                refCode &&
                (
                    refCode.length !== 12 ||
                    !/^[A-Za-z0-9]+$/.test(refCode)
                )
            ) {
                throw new Error("Invalid affiliate code");
            }
            if (refCode) {
                const refUser = await UsersModel.findOne({
                    where: {
                        ref_code: refCode
                    }
                })
                if (refUser) {
                    const newBalance = Number(refUser.balance) + config.SITE.BAND.NEW_REGISTER_NOTES;
                    await refUser.update({
                        balance: newBalance
                    })
                    refUsed = refUser.ref_code;
                }
            }
            const authToken = generateRandomString(96);
            const avatarUri = await getAvatarUri(avatar);
            await UsersModel.create({
                telegram_id: userInfo.id,
                name: userInfo.first_name,
                bandname: bandName,
                avatar: avatarUri,
                ref_code: generateRandomString(12),
                ref_used: refUsed,
                auth_token: authToken,
            });
            return {success: true}
        }
    )
};
