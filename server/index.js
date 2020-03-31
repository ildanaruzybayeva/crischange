const express = require('express');
const cors = require('cors');
const graphql = require('graphql');
const expressGraphQl = require('express-graphql');
const { query } = require('./schemas/query');
const bodyParser = require('body-parser');
//const { mutation } = require("./schemas/mutations");
const client = require('./db');

/**
 * SETUP EXPRESS SERVER
 */

const app = express();
const port = 3000;

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM profile';
        const result = await client.query(sql);
        res.send(result.rows);
    } catch (err) {
        res.status(404).json('Page not found');
    }
});

app.get('/users/:email', async (req, res) => {
    try {
        const sql1 = `
            SELECT * FROM profile 
            JOIN profiles ON profile.id = profiles.user_id 
            WHERE profile.email = $1;
        `;
        const values1 = [req.params.email];
        const result1 = await client.query(sql1, values1);

        const sql2 = `
            SELECT * FROM profiles_fields 
            WHERE user_id = $1 
        `;
        const values2 = [result1.rows[0].user_id];
        const result2 = await client.query(sql2, values2);

        const reducer = (acc, curr) => ({ ...acc, [curr.name]: curr.value });
        const res2Object = result2.rows.reduce(reducer, {});

        res.send({ ...result1.rows[0], ...res2Object });
    } catch (err) {
        res.status(404).json('Error, user not found');
    }
});

app.post('/users/:email', async (req, res) => {
    try {
        const sql1 = `
            SELECT * FROM users 
            WHERE email = $1
            `;
        const values1 = [req.params.email];
        const result1 = await client.query(sql1, values1);

        const par3 =
            typeof req.body.value === 'string' ? `to_json($3::text)` : `$3`;

        const sql = `
            INSERT INTO "profiles_fields" ("user_id", "name", "value")
            VALUES ($1, $2, ${par3})
            ON CONFLICT ON CONSTRAINT profiles_fields_pkey
            DO UPDATE SET
            value = EXCLUDED.value;`;

        const values2 = [result1.rows[0].id, req.body.name, req.body.value];
        const result2 = await client.query(sql, values2);
        res.send(result2);
    } catch (err) {
        console.log(err);
    }
});

/**
 * SETUP GRAPHQL ENDPOINT
 */

const { GraphQLSchema } = graphql;

const schema = new GraphQLSchema({
    query,
});

app.use(
    '/graphql',
    expressGraphQl({
        schema: schema,
        graphiql: true,
    }),
);

app.listen(port, () => console.log(`The app is listening on port ${port}!`));
