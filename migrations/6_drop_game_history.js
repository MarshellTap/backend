'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable(
            'drop_game_history',
            {
                id: {
                    type: Sequelize.DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                },
                track_id: {
                    type: Sequelize.DataTypes.BIGINT,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'drop_game_tracks',
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
                    type: Sequelize.DataTypes.INTEGER,
                    allowNull: false
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
            migration.addIndex('drop_game_history', ['id', 'track_id', 'user_id', 'amount']);
        });
    },
    down: function (migration, DataTypes, done) {
        migration.dropTable('drop_game_history').done(done);
    },
}