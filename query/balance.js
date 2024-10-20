const graphql = require('graphql')
const { authorizeUser } = require("../middlewares.graphql")

const { GraphQLObjectType, GraphQLFloat } = graphql

const BalanceType = new GraphQLObjectType({
	name: 'Balance',
	fields: () => ({
		amount: { type: GraphQLFloat },
	}),
})

module.exports = {
	type: BalanceType,
	args: {},
	resolve: authorizeUser(
		(parent, args, ctx, info) => {
			return {
				amount: info.user.balance,
			}
		},
	)
}
