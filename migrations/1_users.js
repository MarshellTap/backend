'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
	up: function (migration, Sequelize) {
		return migration.createTable(
			'users',
			{
				id: {
					type: Sequelize.DataTypes.BIGINT,
					primaryKey: true,
					autoIncrement: true,
				},
				telegram_id: {
					type: Sequelize.DataTypes.BIGINT,
					allowNull: false,
				},
				avatar: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				name: {
					type: Sequelize.DataTypes.STRING,
					charset: 'utf8mb4',
					collate: 'utf8mb4_general_ci',
					allowNull: false,
				},
				bandname: {
					type: Sequelize.DataTypes.STRING,
					charset: 'utf8mb4',
					collate: 'utf8mb4_general_ci',
					allowNull: false,
				},
				balance: {
					type: DataTypes.BIGINT,
					defaultValue: 0,
				},
				ref_code: {
					type: Sequelize.DataTypes.STRING(32),
					allowNull: false,
				},
				ref_used: {
					type: Sequelize.DataTypes.STRING(32),
					allowNull: true,
				},
				ref_available: {
					type: Sequelize.DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0
				},
				ref_earned: {
					type: Sequelize.DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0
				},
				auth_token: {
					type: DataTypes.STRING,
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
			migration.addIndex('users', ['id', 'bandname', 'auth_token', 'telegram_id']);
		});
	},
	down: function (migration, DataTypes, done) {
		migration.dropTable('users').done(done);
	},
}