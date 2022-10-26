const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: async(parent, args) => { // parent is the current book.
        return await Author.findById(parent.authorId);
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: async(parent, args) => {
        return await Book.find({ authorId: parent.id });
      }
    }
  })
})

/*
Query example:
{
  book(id: 1){
    name
    author{
      name
    }
  }
}

Query example:
{
  author(id: 1){
    name
    books{
      name
    }
  }
}
*/

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: async(parent, args) => {
        /* 
          Note there's no ID type on JS, So GraphQLID is converted to String on JS.
          So e.id === args.id is not equal because this int and that is string now.
        */
        return await Book.findById(args.id);
      }
    },
    // {author(id: 1){name}} => return author's name with id equal 1.
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: async(parent, args) => {
        return await Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: async(parent, args) => {
        return await Book.find({});
      }
    },
    // {authors {name}} => return all authors names.
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: async(parent, args) => {
        return await Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async(parent, args) => {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return await author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async(parent, args) => {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return await book.save();
      }
    },
    editBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve: async(parent, args) => {
        const newBook = {
          name: args.name || undefined, //Can't make it like this: args.name? undefined : args.name, here you check for falsy values, we just check for null.
          genre: args.genre || undefined, // Or args.genre === null? undefined : args.genre
          authorId: args.authorId || undefined, //With undefined values will not update the fields.
        };
        return await Book.findByIdAndUpdate(args.id, newBook, { new: true, runValidators: true });
      }
    },
    editAuthor: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: async(parent, args) => {
        const newAuthor = {
          name: args.name || undefined,
          age: args.age || undefined,
        };
        return await Author.findByIdAndUpdate(args.id, newAuthor, { new: true, runValidators: true });
      }
    },
    deleteBook: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: async(parent, args) => {
        return await Book.findByIdAndDelete(args.id);
      }
    },
    deleteAuthor: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: async(parent, args) => {
        return await Author.findByIdAndDelete(args.id);
      }
    }
  }
});

/*
mutation{
  addAuthor(name: "kero", age: 24){
    name
    age
  }
}
// return just the name 

mutation{
  addBook(name: "kero", genre: "fantasy", authorId: 1){
    name
    genre
    authorId
  }
}
*/


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
