const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Hello",
        fields: ()=>({
            message: {
                type: GraphQLString,
                resolve: () => 'Hellow :)'
            }
        })
    })
})

app.use('/graphql', graphqlHTTP({
    graphiql: true , schema: schema
}))

app.listen(5000, () => console.log("Server Running"))