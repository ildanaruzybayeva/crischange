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

app.use(cors())

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


app.get("/", async (request, reply) => {
  const sql = "SELECT * FROM users";
  const result = await client.query(sql);
  reply.send(result.rows);
});

app.get("/users/:email", async (request, res) => {
  const sql1 = `
    SELECT * FROM users 
    JOIN profiles ON users.id = profiles.user_id 
    WHERE users.email = $1;
  `;
  const values1 = [request.params.email];
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


// app.post("/users/:email", async (request, res) => {
//   const sql1 = `
//     SELECT * FROM users 
//     JOIN profiles_fields ON users.id = profiles_fields.user_id 
//     WHERE email = $1;
//   `;
//   const values1 = [request.params.email];
//   const result1 = await client.query(sql1, values1);
//   console.log(result1.rows[0].user_id)

//   const sql2 = `
//     INSERT INTO profiles_fields(name, value) 
//     VALUES ($1, $2) 
//     WHERE user_id=$3;
//   `;
//   const values = [request.body.name, request.body.value, result1.rows[0].user_id];
//   const result = await client.query(sql2, values);
//   res.send(result);
// });

app.post("/users", async (request, res) => {
    try {
        const sql = "INSERT INTO users (email, password) VALUES ($1, $2);";
        const values = [request.body.email, request.body.password];
        const result = await client.query(sql, values);
        reply.send(result);
    } catch(err) {
        console.log(err)
    }
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))