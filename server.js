
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList
} = require('graphql')

const app = express();

const authors = require('./data/authors')
const books = require('./data/books')

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Authors form authors.js file",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        country: {type: GraphQLNonNull(GraphQLString)},
        birthYear: {type: GraphQLNonNull(GraphQLInt)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "Book from books.js file",
    fields: ()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        author: {type: GraphQLNonNull(GraphQLString)},
        authorBirthYear: {
            type: GraphQLNonNull(GraphQLInt),
            resolve: (book) => {
                return authors.find(author => author.id === book.id).birthYear
            }
        },
        description: {type: GraphQLNonNull(GraphQLString)},
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "Root Query for GraphQL",
    fields: ()=>({
        books: {
            type: new GraphQLList(BookType),
            description: "List all books",
            resolve:() => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List all authors",
            resolve:() => authors
        }
    })
})

const schema = new GraphQLSchema({query:RootQuery})

app.use('/graphql', graphqlHTTP({
    graphiql: true , schema: schema
}))

app.listen(5000, () => console.log("Server Running"))