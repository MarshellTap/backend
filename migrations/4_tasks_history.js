'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable(
            'tasks_history',
            {
                id: {
                    type: Sequelize.DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                },
                tasks_id: {
                    type: Sequelize.DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'tasks',
                        },
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
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
            migration.addIndex('tasks_history', ['id', 'tasks_id', 'user_id', 'amount']);
        });
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable('tasks_history').done(done);
    },
}