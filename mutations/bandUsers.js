const graphql = require("graphql");
const {authorizeUser} = require("../middlewares.graphql");
const {GraphQLList} = require("graphql/type");
const {UsersModel} = require("../models.sequelize");

const PAGE_SIZE = 5

const { GraphQLInt, GraphQLString, GraphQLObjectType } = graphql;

const BandUserItemType = new GraphQLObjectType({
    name: "BandUserItem",
    fields: () => ({
        avatar: { type: GraphQLString },
        name: { type: GraphQLString },
        amount: { type: GraphQLInt },
    }),
});

const BandUsersPageType = new GraphQLObjectType({
    name: "BandUsersPage",
    fields: () => ({
        current: { type: GraphQLInt },
        total: { type: GraphQLInt },
    }),
});

const BandUsersType = new GraphQLObjectType({
    name: "BandUsers",
    fields: () => ({
        items: { type: new GraphQLList(BandUserItemType) },
        page: { type: BandUsersPageType },
        count: { type: GraphQLInt },
    }),
});

module.exports = {
    type: BandUsersType,
    args: {
        page: { type: GraphQLInt },
    },
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            const page = Number(args.page);
            if (page < 1) {
                throw new Error('A page cannot be less than one');
            }
            const options = {
                attributes: [
                    'avatar',
                    'name',
                    ['ref_earned', 'amount']
                ],
                page: page,
                paginate: PAGE_SIZE,
                order: [['id', 'DESC']],
                where: {
                    ref_used: info.user.ref_code
                },
                raw: true
            }
            const { docs: items, pages, total } = await UsersModel.paginate(options)
            return {
                items: items,
                page: {
                    current: page,
                    total: pages
                },
                count: total
            };
        }
    )
};
