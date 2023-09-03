const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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
}

type RootMutation{
    createEvent(eventType:EventInput):Event!
    createUser(userType:UserInput):User!
}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);
