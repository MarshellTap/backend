const Sequelize = require('sequelize')
const config = require('./config')

module.exports = new Sequelize(
	config.SEQUELIZE.production.database,
	config.SEQUELIZE.production.username,
	config.SEQUELIZE.production.password,
	{
		host: config.SEQUELIZE.production.host,
		dialect: 'mysql',
		dialectOptions: {
			charset: 'utf8mb4',
		},
		logging: false,
	}
)
