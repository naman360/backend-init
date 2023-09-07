const Event = require("../../models/event");
const User = require("../../models/user");
const { user } = require("./utils");

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
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Not Authenticated");
        }
        try {
            const { title, description, price, date } = args.eventType;
            let createdEvent;
            const event = new Event({
                title,
                description,
                price,
                date: new Date(date),
                createdBy: req.userId,
            });

            const result = await event.save();

            createdEvent = {
                ...result._doc,
                createdBy: user.bind(this, result._doc.createdBy),
            };
            const creatorUser = await User.findById(req.userId);

            creatorUser.createdEvents.push(event);
            await creatorUser.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
