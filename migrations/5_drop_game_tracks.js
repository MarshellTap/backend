'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable(
            'drop_game_tracks',
            {
                id: {
                    type: Sequelize.DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                },
                image: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false
                },
                author: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false
                },
                name: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false
                },
                source: {
                    type: Sequelize.DataTypes.STRING,
                    allowNull: false
                },
                status: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
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
            migration.addIndex('drop_game_tracks', ['id', 'status']);
        });
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable('drop_game_tracks').done(done);
    },
}