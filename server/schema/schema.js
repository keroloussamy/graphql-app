const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const bookData = [
  {id: 1, name: 'John Doe', genre: 'Book 1', authorId: 1},
  {id: 2, name: 'Emilia William', genre: 'Book 2', authorId: 2},
  {id: 3, name: 'Tito Well', genre: 'Book 3', authorId: 1}
]

const authorData = [
  {id: 1, name: 'Author 1', age: 1},
  {id: 2, name: 'Author 2', age: 2},
  {id: 3, name: 'Author 3', age: 3}
]


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) { // parent is the current book.
        return authorData.find((e) => e.id == parent.authorId );
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
        return bookData.filter((e) => e.authorId == parent.id)
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
        return bookData.find((e) => e.id == args.id );
      }
    },
    // {author(id: 1){name}} => return author's name with id equal 1.
    author: {
      type: AuthorType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args){ 
        // Get data from DB.
        return authorData.find((e) => e.id == args.id );
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){ 
        return bookData;
      }
    },
    // {authors {name}} => return all authors names.
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){ 
        return authorData;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

