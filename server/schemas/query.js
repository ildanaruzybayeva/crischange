const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } = require("graphql");
const { UserType, ProfileType } = require("./types");
const { Client } = require('pg')

const client = new Client()
client.connect()

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: { 
      type: new GraphQLList(UserType),
      args: { email: { type: GraphQLString } },
      resolve: async (parentValue, args) => {
        //const sql = `SELECT * FROM users WHERE email = $1`;
        const sql = "WITH query AS(SELECT * FROM users JOIN profiles ON users.id = profiles.user_id JOIN profiles_fields ON users.id = profiles_fields.user_id) SELECT * FROM query WHERE email=$1;";
        const values = [args.email];
        const result = await client.query(sql, values);
        console.log(result.rows)
        return result.rows
      }
    },
    profile: {
        type: new GraphQLList(ProfileType),
        //args: { user_id: {type: GraphQLID }},
        resolve: async (parentValue, args) => {
            const sql = "SELECT * FROM profiles"
            const result = await client.query(sql)
            return result.rows
        }
    }
  }
});

exports.query = RootQuery;