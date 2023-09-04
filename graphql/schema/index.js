const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Booking{
    _id:ID!
    user:User!
    event:Event!
    createdAt:String!
    updatedAt:String!
}

type Event{
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String
    createdBy:User!
}

type User{
    _id:ID!
    email:String!
    password:String
    createdEvents:[Event!]
}

input UserInput{
    email:String!
    password:String!
}

input EventInput{
    title:String!
    description:String!
    price:Float!
    date:String
}

type RootQuery{
    events:[Event!]!
    bookings:[Booking!]!
}

type RootMutation{
    createEvent(eventType:EventInput):Event!
    createUser(userType:UserInput):User!
    bookEvent(eventId:ID!):Booking!
    cancelBooking(bookingID:ID!):Event!
}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);
