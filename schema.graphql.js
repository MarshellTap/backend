const graphql = require('graphql')

/* Mutations */
const initGameMutation = require('./mutations/initGame')
const checkingAvailabilityBandNameMutation = require("./mutations/checkingAvailabilityBandName")
const createBandMutation = require("./mutations/createBand")
const initUserMutation = require("./mutations/initUser")
const claimDailyRewardsMutation = require("./mutations/claimDailyRewards")
const claimTasksMutation = require("./mutations/claimTasks")
const claimBandEarnMutation = require("./mutations/claimBandEarn")
const bandUsersMutation = require("./mutations/bandUsers")
const completeDropGameMutation = require('./mutations/completeDropGame')

/* Query */
const balanceQuery = require('./query/balance')
const tasksQuery = require('./query/tasks')
const bandQuery = require('./query/band')
const dropGameTracksQuery = require("./query/dropGameTracks")

const { GraphQLObjectType, GraphQLSchema } = graphql

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		initGame: initGameMutation,
		checkingAvailabilityBandName: checkingAvailabilityBandNameMutation,
		createBand: createBandMutation,
		initUser: initUserMutation,
		claimDailyRewards: claimDailyRewardsMutation,
		claimTasks: claimTasksMutation,
		claimBandEarn: claimBandEarnMutation,
		bandUsers: bandUsersMutation,
		completeDropGame: completeDropGameMutation
	},
})

const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		balance: balanceQuery,
		tasks: tasksQuery,
		band: bandQuery,
		dropGameTracks: dropGameTracksQuery
	},
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
})