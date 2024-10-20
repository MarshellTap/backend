const graphql = require('graphql')
const { authorizeUser } = require("../middlewares.graphql")
const {GraphQLList} = require("graphql/type");
const {DropGameTracksModel, DropGameHistoryModel} = require("../models.sequelize");
const moment = require("moment-timezone");

const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql

const DropGameTrackItemType = new GraphQLObjectType({
    name: "DropGameTrackItem",
    fields: () => ({
        id: { type: GraphQLInt },
        image: { type: GraphQLString },
        source: { type: GraphQLString },
        author: { type: GraphQLString },
        name: { type: GraphQLString },
        next_timer: { type: GraphQLInt },
        history_created_at: { type: GraphQLInt },
    }),
});

module.exports = {
    type: new GraphQLList(DropGameTrackItemType),
    args: {},
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const tracks = [];
            const dbTracks = await DropGameTracksModel.findAll({
                include: [
                    {
                        model: DropGameHistoryModel,
                        order: [['id', 'DESC']],
                        where: {
                            user_id: info.user.id,
                        },
                        limit: 1,
                        as: 'history'
                    },
                ],
            });
            const currentUnix = moment().unix()
            for (const dbTrack of dbTracks) {
                const lastItem = dbTrack.history.length ? dbTrack.history[0] : null;
                let next_timer = 0, history_created_at = 0
                if (lastItem) {
                    const ifDayUnix = moment(lastItem.createdAt).unix()
                    const ifDay = currentUnix - ifDayUnix;
                    if (ifDay < 86400) {
                        next_timer = 86400 - ifDay
                        history_created_at = ifDayUnix
                    }
                }
                tracks.push({
                    id: dbTrack.id,
                    image: dbTrack.image,
                    source: dbTrack.source,
                    author: dbTrack.author,
                    name: dbTrack.name,
                    next_timer: next_timer,
                    history_created_at: history_created_at
                })
            }
            return tracks;
        },
    )
}
