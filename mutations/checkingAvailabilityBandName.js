const graphql = require("graphql");
const checkingAvailabilityBandName = require("../functions/checkingAvailabilityBandName")
const {guestRequest} = require("../middlewares.graphql");

const { GraphQLBoolean, GraphQLString, GraphQLObjectType } = graphql;

const CheckingAvailabilityBandNameType = new GraphQLObjectType({
    name: "CheckingAvailabilityBandName",
    fields: () => ({
        available: { type: GraphQLBoolean },
    }),
});

module.exports = {
    type: CheckingAvailabilityBandNameType,
    args: {
        bandName: { type: GraphQLString },
    },
    resolve: guestRequest(
        async (parent, args) => {
            return await checkingAvailabilityBandName(args.bandName);
        }
    ),
};
