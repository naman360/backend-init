const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
        type RootQuery{
            events:[String!]!
        }
        type RootMutation{
            createEvent(name:String):String
        }
        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
        rootValue: {
            events: () => ["Event 1", "Event 2", "Event 3"],
            createEvent: (args) => {
                return args.name;
            },
        },
        graphiql: true,
    })
);
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
