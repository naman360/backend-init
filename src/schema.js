const { gql } = require("apollo-server");

const typeDefs = gql`
    type User {
        id: Int!
        name: String!
        username: String!
        menu: [Recipe!]!
    }
    type Recipe {
        id: Int!
        title: String!
        ingredients: String!
        user: User!
    }
    type Query {
        user(id: Int!): User
        allUsers: [User!]
        allRecipes: [Recipe!]
        recipe(id: Int!): Recipe
    }

    type Mutations {
        createUser(name: String!, username: String!, password: String!): User!
        createRecipe(
            title: String!
            ingredients: String!
            userId: Int!
        ): Recipe!
    }
`;

module.exports = typeDefs;
