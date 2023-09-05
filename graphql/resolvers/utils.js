const Event = require("../../models/event");
const User = require("../../models/user");

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

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            createdBy: user.bind(this, event._doc.createdBy),
        };
    } catch (error) {
        console.log(error);
        throw error;
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

module.exports = { events, singleEvent, user };
