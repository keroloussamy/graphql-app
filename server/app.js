const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const MONGO_URL = 'mongodb+srv://kero:1234@cluster0.2eous.mongodb.net/graphql-app?retryWrites=true&w=majority'
mongoose.connect(MONGO_URL)
mongoose.connection.once('open', () => {
    console.log('Connected to database');
});


//express don't know how to deal with graphql but express-graphql. So any request for graphql let express-graphql deal with it.
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // To open graphiql tool.
}))

app.listen(4000, () => {
    console.log('Your app is working on 4000');
})