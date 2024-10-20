const graphql = require("graphql");
const {authorizeUser} = require("../middlewares.graphql");
const {DropGameHistoryModel, DropGameTracksModel} = require("../models.sequelize");
const moment = require("moment-timezone");
const sendRefPercent = require("../functions/sendRefPercent");
const secondsToHMS = require("../helpers/secondsToHMS");

const { GraphQLInt, GraphQLObjectType } = graphql;

const CompleteDropGameType = new GraphQLObjectType({
    name: "CompleteDropGame",
    fields: () => ({
        balance: { type: GraphQLInt },
        amount: { type: GraphQLInt }
    }),
});

module.exports = {
    type: CompleteDropGameType,
    args: {
        notes: { type: GraphQLInt },
        track_id: { type: GraphQLInt }
    },
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const trackId = args.track_id,
                notes = args.notes;
            if (!trackId || !/^\d+$/.test(trackId)) {
                throw new Error("The track was transmitted incorrectly")
            }
            if (!notes || !/^\d+$/.test(notes)) {
                throw new Error("The amount of notes was incorrectly transferred")
            }
            if (notes > 5000) {
                throw new Error("Hacking attempt!")
            }
            const track = await DropGameTracksModel.findOne({
                where: {
                    id: trackId
                },
            })
            if (!track) {
                throw new Error("The track you have selected was not found")
            }
            const currentUnix = moment().unix()
            const history = await DropGameHistoryModel.findOne({
                where: {
                    user_id: info.user.id,
                    track_id: track.id
                },
                order: [['id', 'DESC']]
            })
            if (history) {
                const ifDayUnix = moment(history.createdAt).unix();
                const ifDay = currentUnix - ifDayUnix;
                if (ifDay < 86400) {
                    throw new Error("You can listen to this track via " + secondsToHMS(ifDay))
                }
            }
            await DropGameHistoryModel.create({
                track_id: track.id,
                user_id: info.user.id,
                amount: notes,
            });
            const newBalance = Number(info.user.balance) + notes;
            await info.user.update({ balance: newBalance });
            if (info.user.ref_used) {
                await sendRefPercent(info.user.id, info.user.ref_used, notes);
            }
            return {
                balance: info.user.balance,
                amount: notes
            };
        }
    )
};
