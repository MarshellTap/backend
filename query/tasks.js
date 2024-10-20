const graphql = require('graphql')
const { authorizeUser } = require("../middlewares.graphql")
const {GraphQLList} = require("graphql/type");
const getUserTasks = require("../functions/getUserTasks");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } = graphql

const TasksInfoType = new GraphQLObjectType({
    name: "TasksInfoType",
    fields: () => ({
        type: { type: GraphQLString },
        link: { type: GraphQLString },
        amount: { type: GraphQLInt },
        count: { type: GraphQLInt },
    }),
});

const TasksItemType = new GraphQLObjectType({
    name: "TasksItemType",
    fields: () => ({
        id: { type: GraphQLInt },
        type: { type: GraphQLString },
        title: { type: GraphQLString },
        reward: { type: GraphQLInt },
        info: { type: TasksInfoType },
        claim: { type: GraphQLBoolean },
    }),
});

const TasksType = new GraphQLObjectType({
    name: "TasksType",
    fields: () => ({
        own: { type: new GraphQLList(TasksItemType) },
        other: { type: new GraphQLList(TasksItemType) }
    }),
});

module.exports = {
    type: TasksType,
    args: {},
    resolve: authorizeUser(
        async (parent, args, ctx, info) => {
            return await getUserTasks(info.user.id, info.user.ref_code);
        },
    )
}
