const graphql = require('graphql')
const { authorizeUser } = require("../middlewares.graphql")

const { GraphQLObjectType, GraphQLInt } = graphql

const BandType = new GraphQLObjectType({
    name: 'Band',
    fields: () => ({
        available: { type: GraphQLInt },
    }),
})

module.exports = {
    type: BandType,
    args: {},
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            return {
                available: info.user.ref_available,
            }
        },
    )
}
