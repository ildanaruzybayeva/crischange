const express = require("express");
const app = express()
const port = 4000
const cors = require('cors')
const { Client } = require('pg')
const graphql = require("graphql");
const expressGraphQl = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require('./schemas/query');
const bodyParser = require('body-parser')
//const { mutation } = require("./schemas/mutations");

app.use(cors())
app.use(bodyParser)

const client = new Client()
client.connect()

const schema = new GraphQLSchema({
  query
});

app.use(
  '/graphql',
  expressGraphQl({
    schema: schema,
    graphiql: true
  })
);


app.get("/", async (req, res) => {
  const sql = "SELECT * FROM users";
  const result = await client.query(sql);
  res.send(result.rows);
});

app.get("/users/:email", async (req, res) => {
  const sql1 = `
    SELECT * FROM users 
    JOIN profiles ON users.id = profiles.user_id 
    WHERE users.email = $1;
  `;
  const values1 = [req.params.email];
  const result1 = await client.query(sql1, values1);

  const sql2 = `
    SELECT * FROM profiles_fields 
    WHERE user_id = $1 
  `;
  const values2 = [result1.rows[0].user_id]
  const result2 = await client.query(sql2, values2)

  const finalResult = [...result1.rows, ...result2.rows]
  
  res.send(finalResult);
});


app.post("/users", async (req, res) => {
    try {
        const sql = "INSERT INTO users (email, password) VALUES ($1, $2);";
        const values = [req.body.email, req.body.password];
        const result = await client.query(sql, values);
        res.send(result);
    } catch(err) {
        console.log(err)
    }
});


app.post("/users/:email", async (req, res) => {
try {
 const sql1 = `
    SELECT * FROM users 
    JOIN profiles_fields 
    ON users.id = profiles_fields.user_id 
    WHERE email = $1;
  `;
  const values1 = [req.params.email];
  const result1 = await client.query(sql1, values1);
  console.log(result1.rows[0].user_id)

  const sql2 = `
    INSERT INTO profiles_fields(name, value) 
    VALUES ($1, $2) 
    WHERE user_id=$3;
  `;
  const values2 = [req.body.name, req.body.value, result1.rows[0].user_id];
  const result2 = await client.query(sql2, values2);
  res.send(result2);
} catch(err){
    console.log(err)
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))