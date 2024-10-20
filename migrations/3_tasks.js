'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable(
            'tasks',
            {
                id: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                },
                category: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                },
                type: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                },
                title: {
                    type: DataTypes.STRING(128),
                    allowNull: false,
                },
                info: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                reward: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 1
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
            migration.addIndex('tasks', ['id', 'category', 'type', 'reward', 'status']);
        });
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable('tasks').done(done);
    },
}