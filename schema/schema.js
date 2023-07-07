const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList
} = require('graphql')

const books = require("../data/books");
const authors = require("../data/authors");

exports.AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Authors form authors.js file",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        country: {type: GraphQLNonNull(GraphQLString)},
        birthYear: {type: GraphQLNonNull(GraphQLInt)},
        books: {
            type: new GraphQLList(this.BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
    })
})

exports.BookType = new GraphQLObjectType({
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