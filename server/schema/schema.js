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
      resolve(parent, args) { // parent is the current book.
        return Author.findById(parent.authorId);
      }
    }
  })
})

/*
Query example
{
  book(id: 1){
    name
    author{
      name
    }
  }
}
*/

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find({ authorId: parent.id });
      }
    }
  })
})

/*
Query example
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
      args: {id: { type: GraphQLID }},
      resolve(parent, args){ 
        /* 
          Note there's no ID type on JS, So GraphQLID is converted to String on JS.
          So e.id === args.id is not equal because this int and that is string now.
        */
        return Book.findById(args.id);
      }
    },
    // {author(id: 1){name}} => return author's name with id equal 1.
    author: {
      type: AuthorType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args){ 
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){ 
        return Book.find({});
      }
    },
    // {authors {name}} => return all authors names.
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){ 
        return Author.find({});
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
          resolve(parent, args){
              let author = new Author({
                  name: args.name,
                  age: args.age
              });
              return author.save();
          }
      },
      addBook: {
          type: BookType,
          args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
              genre: { type: new GraphQLNonNull(GraphQLString) },
              authorId: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve(parent, args){
              let book = new Book({
                  name: args.name,
                  genre: args.genre,
                  authorId: args.authorId
              });
              return book.save();
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

