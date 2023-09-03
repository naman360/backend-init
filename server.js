const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();

const Event = require("./models/event");
const User = require("./models/user");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then((events) => {
            return events.map((event) => {
                return {
                    ...event._doc,
                    _id: event.id,
                    createdBy: user.bind(this, event._doc.createdBy),
                };
            });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const user = (userId) => {
    return User.findById(userId)
        .then((user) => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents),
            };
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};
app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
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
    `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then((events) =>
                        events.map((event) => {
                            return {
                                ...event._doc,
                                _id: event._doc._id.toString(),
                                createdBy: user.bind(
                                    this,
                                    event._doc.createdBy._id
                                ),
                            };
                        })
                    )
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
            createEvent: (args) => {
                const { id, title, description, price, date } = args.eventType;
                let createdEvent;
                const event = new Event({
                    title,
                    description,
                    price,
                    date: new Date(date),
                    createdBy: "64f47a3c1847324c144ced92",
                });
                return event
                    .save()
                    .then((result) => {
                        createdEvent = {
                            ...result._doc,
                            createdBy: user.bind(this, result._doc.createdBy),
                        };
                        return User.findById("64f47a3c1847324c144ced92");
                    })
                    .then((user) => {
                        user.createdEvents.push(event);
                        return user.save();
                    })
                    .then(() => {
                        return createdEvent;
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
            createUser: (args) => {
                const { email, password } = args.userType;
                return User.findOne({ email: email })
                    .then((user) => {
                        if (user) {
                            throw new Error("User already exists");
                        }
                        return bcrypt.hash(password, 12);
                    })
                    .then((hashedPass) => {
                        const user = new User({
                            email,
                            password: hashedPass,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        return {
                            ...result._doc,
                            password: null,
                            _id: result.id,
                        };
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
        },
        graphiql: true,
    })
);

mongoose
    .connect(process.env.CONN_STRING)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started at ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
