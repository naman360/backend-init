const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { mongoose } = require("mongoose");
const app = express();

const Event = require("./models/event");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
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
        }
        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
        rootValue: {
            events: () => {
                return Event.find().then((events) =>
                    events.map((event) => {
                        return {
                            ...event._doc,
                            _id: event._doc._id.toString(),
                        };
                    })
                );
            },
            createEvent: (args) => {
                const { id, title, description, price, date } = args.eventType;
                const event = new Event({
                    title,
                    description,
                    price,
                    date: new Date(date),
                });
                return event
                    .save()
                    .then((result) => {
                        console.log(result);
                        return { ...result._doc };
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
