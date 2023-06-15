const User = require("../models/user");
exports.getLoggerUser = async (userId) => await User.findById(userId);
