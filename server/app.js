const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

//express don't know how to deal with graphql but express-graphql. So any request for graphql let express-graphql deal with it.
app.use('/qraphql', graphqlHTTP({
    schema,
    graphiql: true // To open graphiql tool.
}))

app.listen(4000, () => {
    console.log('Your app is working on 4000');
})