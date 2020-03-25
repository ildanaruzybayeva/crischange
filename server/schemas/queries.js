const { Client } = require('pg')
const { GraphQLObjectType, GraphQLID } = require("graphql");
const { UserType, ProjectType } = require("./types");

const client = new Client({
    connectionString: process.env.CSTRING
})
client.connect()

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve: async (parentValue, args) => {
        const sql = "SELECT * FROM project WHERE id=$1";
        const values = [args.id];
        const result = await client.query(sql, values)
        return result.rows[0]
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (parentValue, args) => {
        const sql = "SELECT * FROM users WHERE id=$1";
        const values = [args.id];
        const result = await client.query(sql, values)
        console.log(result.rows)
        return result.rows[0]
      }
    }
  }
});

exports.query = RootQuery;