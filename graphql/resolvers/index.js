const authResolvers = require("../resolvers/auth");
const bookingResolvers = require("../resolvers/booking");
const eventResolvers = require("../resolvers/event");
module.exports = { ...authResolvers, ...bookingResolvers, ...eventResolvers };
