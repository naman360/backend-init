const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
    createUser: async (args) => {
        try {
            const { email, password } = args.userType;
            const user = await User.findOne({ email: email });

            if (user) {
                throw new Error("User already exists");
            }
            const hashedPass = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                password: hashedPass,
            });
            const result = await newUser.save();

            return {
                ...result._doc,
                password: null,
                _id: result.id,
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async (args) => {
        const { email, password } = args;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("User does not exist");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error("Password is incorrect");
        }
        const token = jwt.sign(
            { email, password },
            "ververlongsecretkeyusetohash",
            {
                expiresIn: "1h",
            }
        );
        return {
            userId: user.id,
            token,
            tokenExpiration: 1,
        };
    },
};
