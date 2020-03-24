const express = require("express");
const app = express()
const port = 3000
const cors = require('cors')
const { Client } = require('pg')
const graphql = require("graphql");
const expressGraphQl = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require('./schemas/query');
//const { mutation } = require("./schemas/mutations");

const client = new Client()
client.connect()

const schema = new GraphQLSchema({
  query
});

app.use(
  '/',
  expressGraphQl({
    schema: schema,
    graphiql: true
  })
);

app.use(cors())

app.get("/", async (request, reply) => {
  const sql = "SELECT * FROM users";
  const result = await client.query(sql);
  reply.send(result.rows);
});

app.get("/users/:email", async (request, reply) => {
  const sql = "WITH query AS(SELECT * FROM users JOIN profiles ON users.id = profiles.user_id JOIN profiles_fields ON users.id = profiles_fields.user_id) SELECT * FROM query WHERE email=$1;";
  const values = [request.params.email];
  const result = await client.query(sql, values);
  reply.send(result.rows);
});


app.post("/users/:email", async (request, reply) => {
  const sql = "INSERT INTO profiles_fields (name, value) VALUES ($1, $2) WHERE email=$1;";
  const values = [request.body.name, request.body.value];
  const result = await client.query(sql, values);
  reply.send(result);
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))