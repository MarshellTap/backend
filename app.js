const express = require('express')
const cors = require('cors')
const { createHandler } = require('graphql-http/lib/use/http')
const config = require('./config')
const schema = require('./schema.graphql')
const sequelize = require('./sequelize')
const {Telegraf} = require("telegraf");
const R2Client = require("cloudflare-r2-sdk");

/* Models */
const {UsersModel} = require("./models.sequelize");

/* Memory */
const {socketIoUsers, temporaryIoUsers} = require("./memory/socketIoUsers");
const telegramBot = require("./memory/telegram.bot")
const cloudflareR2 = require("./memory/cloudflare.r2")

/* Telegram Main Bot */
telegramBot.bot = new Telegraf(config.BOT_TOKEN);
telegramBot.session = telegramBot.bot?.telegram;

/* Telegram Checker Bot */
telegramBot.checker.bot = new Telegraf(config.CHECKER_BOT_TOKEN);
telegramBot.checker.session = telegramBot.checker.bot?.telegram;

/* Cloudflare R2 CDN Service */
cloudflareR2.client = new R2Client(
	config.CLOUDFLARE.R2.ACCOUNT_ID,
	config.CLOUDFLARE.R2.ACCESS_KEY,
	config.CLOUDFLARE.R2.SECRET_KEY
);

sequelize
	.authenticate()
	.then(() => {
		console.log('Connected to DB')
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error)
	})

const app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);

const socketIoMiddleware = async (column = 'auth_token', token) => {
	const user = await UsersModel.findOne({ where: {[column]: token} })
	if (!user) return false;
	const temporaryLogged = temporaryIoUsers.findIndex(temp => temp.telegram_id === user.telegram_id)
	if (temporaryLogged !== -1) {
		const temporarySocket = temporaryIoUsers[temporaryLogged].socket;
		temporarySocket.disconnect();
	}
	return true;
}

io.sockets.on('connection', async function(socket) {
	const token = socket.handshake.auth?.token
	if (!token) return await socket.disconnect(true);
	/* Check token type */
	if (/^\d+:.{96}$/.test(token)) {
		const clientTelegramId = Number(token.split(':')[0]);
		const alreadyTemporaryLogged = temporaryIoUsers.findIndex(temp => temp.telegram_id === clientTelegramId)
		if (alreadyTemporaryLogged !== -1) {
			const alreadyTemporarySocket = temporaryIoUsers[alreadyTemporaryLogged].socket;
			alreadyTemporarySocket.emit("game_error", {
				error: true,
				connection_type: "temporary",
				is_multi: true,
				title: "You're already logged in from another device",
				description: "Unfortunately in our app you can only sit for 1 account from 1 device at a time",
				button: {type: "fail", name: "Exit from app", function: "closeApp"}
			})
			alreadyTemporarySocket.disconnect();
		}
		temporaryIoUsers.push({token, socket, telegram_id: clientTelegramId});
	} else if(token.length !== 96 || !/^\d{96}$/.test(token)) {
		const middlewareUser = await socketIoMiddleware('auth_token', token)
		if (!middlewareUser) {
			socket.emit("game_error", {
				error: true,
				connection_type: "auth",
				is_multi: false,
				title: "Error",
				description: "There was an error on our server side",
				button: {type: "success", name: "Refresh app", function: "reloadApp"}
			})
			return socket.disconnect(true);
		}
		socketIoUsers.push({token, socket})
	} else return await socket.disconnect(true);
	socket.on('disconnect', function() {
		if (!token) return
		/* Check token type */
		if (/^\d+:.{96}$/.test(token)) {
			const temporaryIndex = temporaryIoUsers.findIndex(temp => temp.token === token)
			if (temporaryIndex === -1) return
			temporaryIoUsers.splice(temporaryIndex, 1)
		} else if(token.length !== 96 || !/^\d{96}$/.test(token)) {
			const userIndex = socketIoUsers.findIndex(user => user.token === token)
			if (userIndex === -1) return
			socketIoUsers.splice(userIndex, 1)
		}
	});
});

app.use(cors())

const graphqlHandler = createHandler({
	schema: schema,
	context: (req) => req,
	formatError: error => {
		console.error(error)
		return {
			message: error.message,
			path: error.path,
		}
	},
})

app.use('/api/graphql', (req, res) => graphqlHandler(req, res))

server.listen(config.PORT, err => {
	err ? console.log(err) : console.log('Backend server started!')
})