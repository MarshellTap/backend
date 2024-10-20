const { UsersModel } = require("./models.sequelize");
const { socketIoUsers } = require("./memory/socketIoUsers");

const guestRequest = (resolver) => {
  return async (parent, args, context, info) => {
    let authToken = context.headers.token;
    if (authToken === 'null') {
      authToken = null;
    }
    if (authToken) {
      throw new Error("This request is available for unauthorized users");
    }
    return resolver(parent, args, context, info);
  }
}

const authorizeUser = (resolver) => {
  return async (parent, args, context, info) => {
    const authToken = context.headers.token;
    if (!authToken || authToken.length !== 96) {
      throw new Error("Incorrect auth token");
    }
    const user = await UsersModel.findOne({
      where: {
        auth_token: authToken
      }
    });
    if (!user) {
      throw new Error("Auth error");
    }
    info.user = user;
    info.socket = _findUserSocket(user.auth_token);
    return resolver(parent, args, context, info);
  };
};

const _findUserSocket = (auth_token) => {
  const userIndexByAuthToken = socketIoUsers.findIndex(
    (user) => user.token === auth_token,
  );
  if (userIndexByAuthToken === -1) return;
  return socketIoUsers[userIndexByAuthToken].socket;
};

module.exports = {
  authorizeUser,
  guestRequest
};
