const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");
const sequelizePaginate = require('sequelize-paginate')

const UsersModel = sequelize.define(
    "users",
    {
        telegram_id: DataTypes.BIGINT,
        avatar: DataTypes.STRING,
        name: DataTypes.STRING,
        bandname: DataTypes.STRING,
        balance: DataTypes.BIGINT,
        ref_code: DataTypes.STRING(32),
        ref_used: DataTypes.STRING(32),
        ref_earned: DataTypes.INTEGER,
        ref_available: DataTypes.INTEGER,
        auth_token: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true },
);

const DailyRewardsHistoryModel = sequelize.define(
    "daily_rewards_history",
    {
        user_id: DataTypes.BIGINT,
        amount: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true },
);

const TasksModel = sequelize.define(
    "tasks",
    {
        category: DataTypes.STRING(16),
        type: DataTypes.STRING(16),
        title: DataTypes.STRING(128),
        info: DataTypes.JSON,
        reward: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true },
);

const TasksHistoryModel = sequelize.define(
    "tasks_history",
    {
        tasks_id: DataTypes.BIGINT,
        user_id: DataTypes.BIGINT,
        amount: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true },
);

const DropGameTracksModel = sequelize.define(
    "drop_game_tracks",
    {
        image: DataTypes.STRING,
        author: DataTypes.STRING,
        name: DataTypes.STRING,
        source: DataTypes.STRING,
        status: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true }
)

const DropGameHistoryModel = sequelize.define(
    "drop_game_history",
    {
        track_id: DataTypes.BIGINT,
        user_id: DataTypes.BIGINT,
        amount: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    { freezeTableName: true }
)

/* Pagination */
sequelizePaginate.paginate(UsersModel)

/* Association */
DropGameTracksModel.hasMany(DropGameHistoryModel, {
    foreignKey: 'track_id',
    ownerKey: 'id',
    as: 'history'
});

module.exports = {
    UsersModel,
    DailyRewardsHistoryModel,
    TasksHistoryModel,
    TasksModel,
    DropGameTracksModel,
    DropGameHistoryModel
};
