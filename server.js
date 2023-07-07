
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
        book: {
            type: BookType,
            args: {
                id: {type: GraphQLInt}
            },
            description: "Book retrieve by id",
            resolve: (parent, args) => (
                books.find(book => args.id === book.id)
            )
        },
        author: {
            type: AuthorType,
            description: "Author retrieve by id",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => (authors.find(author => author.id === args.id))
        },
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

const RootMutation = new GraphQLObjectType({
    name: "RootMutation",
    description: "Root Mutation for GraphQL",
    fields: {
        addBook: {
            name: "AddBookMutation",
            description: "Add Book mutation",
            type: BookType,
            args: {
                authorId: {type: GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId,
                    description: args.description,
                    author: authors.find(author => args.authorId === author.id).name
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            name: "AddAuthor",
            description: "Add Author mutation",
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                country: {type: GraphQLNonNull(GraphQLString)},
                birthYear: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args)=> {
                const author = {
                    id: authors.length+1,
                    name: args.name,
                    country: args.country,
                    birthYear: args.birthYear
                };
                authors.push(author)
                return author;
            }
        }
}})

const schema = new GraphQLSchema({query:RootQuery, mutation: RootMutation})

app.use('/graphql', graphqlHTTP({
    graphiql: true , schema: schema
}))

app.listen(5000, () => console.log("Server Running"))