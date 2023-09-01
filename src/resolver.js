const resolvers = {
    Query: {
        async user(root) {},
        async allUsers(root) {},
        async allRecipes(root) {},
        async recipe(root) {},
    },
    Mutations: {
        async createUser() {},
        async createRecipe() {},
    },
};

module.exports = resolvers;
