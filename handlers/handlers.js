
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList
} = require('graphql')

const books = require("../data/books");
const authors = require("../data/authors");
const {BookType, AuthorType} = require("../schema/schema");

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

module.exports = new GraphQLSchema({query: RootQuery, mutation: RootMutation})