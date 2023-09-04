const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/Booking");
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
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        try {
            const { title, description, price, date } = args.eventType;
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
    bookEvent: async (args) => {
        const { eventId } = args;
        const event = await Event.findOne({ _id: eventId });
        const booking = new Booking({
            user: "64f47a3c1847324c144ced92",
            event,
        });
        const result = await booking.save();
        console.log(new Date(result._doc.createdAt).toISOString);
        return {
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };
    },
    cancelBooking: async (args) => {
        const { bookingID } = args;
        const booking = await Booking.findById(bookingID).populate("event");

        const event = {
            ...booking.event._doc,
        };
        await Booking.deleteOne({ _id: bookingID });
        return event;
    },
};
