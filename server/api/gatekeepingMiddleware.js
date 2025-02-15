const User = require("../db/models/user");

const requireToken = async (req, res, next) => {
    try {
        //check to see if loggedin
        const token = req.headers.authorization;
        const user = await User.findByToken(token);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requireToken,
};
