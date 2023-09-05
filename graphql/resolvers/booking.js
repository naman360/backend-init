const Event = require("../../models/event");
const Booking = require("../../models/Booking");
const { user, singleEvent } = require("./utils");

module.exports = {
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
            _id: booking.id,
            createdBy: user.bind(this, booking.event._doc.createdBy),
        };
        await Booking.deleteOne({ _id: bookingID });
        return event;
    },
};
