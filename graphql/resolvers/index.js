const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });

        return events.map((event) => {
            return {
                ...event._doc,
                _id: event.id,
                createdBy: user.bind(this, event._doc.createdBy),
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents),
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map((event) => {
                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                    createdBy: user.bind(this, event._doc.createdBy._id),
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        try {
            const { id, title, description, price, date } = args.eventType;
            let createdEvent;
            const event = new Event({
                title,
                description,
                price,
                date: new Date(date),
                createdBy: "64f47a3c1847324c144ced92",
            });

            const result = await event.save();

            createdEvent = {
                ...result._doc,
                createdBy: user.bind(this, result._doc.createdBy),
            };
            const creatorUser = await User.findById("64f47a3c1847324c144ced92");

            creatorUser.createdEvents.push(event);
            await creatorUser.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
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
};
