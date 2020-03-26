const graphql = require("graphql");
const express = require("express");
const expressGraphQl = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/queries");
const { mutation } = require("./schemas/mutations");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser())

const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.CSTRING
})
client.connect()



const schema = new GraphQLSchema({
  query,
  mutation
});


app.use(
  '/graphql',
  expressGraphQl({
    schema: schema,
    graphiql: true
  })
);


app.get("/", async (request, res) => {
    try {
        const sql = "SELECT * FROM users";
        const result = await client.query(sql);
        res.send(result.rows);
    } catch(err) {
        console.log(err)
    }
});

app.post("/", async (request, res) => {
    try {
        const sql = "INSERT INTO users (username, email) VALUES ($1, $2);";
        const values = [request.body.username, request.body.email];
        const result = await client.query(sql, values);
        res.send(result);
    } catch(err) {
        console.log(err)
    }
});

app.listen(3000, () =>
  console.log('GraphQL server running on localhost:3000')
);