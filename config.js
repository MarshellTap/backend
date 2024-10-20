const DB = {
	HOSTNAME: '127.0.0.1',
	USERNAME: 'root',
	PASSWORD: '1q2w3e12',
	DATABASE: 'marshell',
}

const SequelizeDB = {
	username: DB.USERNAME,
	password: DB.PASSWORD,
	database: DB.DATABASE,
	host: DB.HOSTNAME,
	dialect: 'mysql',
}

module.exports = {
	PORT: 3489,
	BOT_TOKEN: "7412708729:AAFtW5YWGUZmQLp2_J9G4iAyWomdAINREq4",
	CHECKER_BOT_TOKEN: "7279086269:AAGSisUPEKRJJMOPCUg2jjvGyhO2resx1PE",
	SEQUELIZE: {
		development: SequelizeDB,
		production: SequelizeDB,
		test: SequelizeDB,
	},
	CLOUDFLARE: {
		R2: {
			ACCOUNT_ID: "08485cdb7d836f260fcba0d13317ebb7",
			SECRET_KEY: "aaaf50193627a139172b4df86c9b91179895e13fa5a7f63c80a74f1cb3e38843",
			ACCESS_KEY: "705bdc3f823177868fe2fc165f83d737",
			BUCKETS: {
				AVATARS: {
					NAME: "avatars",
					DOMAIN: "https://avatars.cdn.marshelltap.com",
					DEFAULT_AVATAR_URI: "/no-avatar.png"
				}
			}
		}
	},
	SITE: {
		BAND: {
			NEW_REGISTER_NOTES: 1000,
			PERCENT_NOTES: 10
		}
	}
}
