const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql;

const data = [
  {id: 1, name: 'John Doe', genre: 'Book 1'},
  {id: 2, name: 'Emilia William', genre: 'Book 2'},
  {id: 3, name: 'Tito Well', genre: 'Book 3'}
]


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: { type: GraphQLID }},
      resolve(parent, args){ 
        // Get data from DB.
        return data.find((e) => e.id === args.id );
      }
    }
  }
});



module.exports = new GraphQLSchema({
  query: RootQuery
});

