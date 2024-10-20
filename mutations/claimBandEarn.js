const graphql = require("graphql");
const {authorizeUser} = require("../middlewares.graphql");

const { GraphQLInt, GraphQLObjectType } = graphql;

const ClaimBandEarnType = new GraphQLObjectType({
    name: "ClaimBandEarn",
    fields: () => ({
        amount: { type: GraphQLInt },
        balance: { type: GraphQLInt },
    }),
});

module.exports = {
    type: ClaimBandEarnType,
    args: {},
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const amount = info.user.ref_available
            if (!amount) {
                throw new Error('You have nothing to take away at this time');
            }
            const newBalance = Number(info.user.balance) + Number(info.user.ref_available);
            await info.user.update({
                balance: newBalance,
                ref_available: 0
            })
            return {
                amount: amount,
                balance: info.user.balance
            }
        }
    )
};
