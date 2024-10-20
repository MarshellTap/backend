'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable(
            'daily_rewards_history',
            {
                id: {
                    type: Sequelize.DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                },
                user_id: {
                    type: Sequelize.DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'users',
                        },
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                },
                updatedAt: {
                    allowNull: true,
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                    onUpdate: Sequelize.NOW,
                },
            },
            {
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            }
        ).then(() => {
            migration.addIndex('daily_rewards_history', ['id', 'user_id', 'amount']);
        });
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable('daily_rewards_history').done(done);
    },
}