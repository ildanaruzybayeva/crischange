const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;
const { ProjectType } = require("./types");
const { Client } = require('pg')

const client = new Client({
    connectionString: process.env.CSTRING
})
client.connect()

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        creatorId: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve: async (parentValue, args) => {
        const sql = `INSERT INTO project(creator_id, created, title, description) VALUES ($1, $2, $3, $4) RETURNING title`;
        const values = [
          args.creatorId,
          new Date(),
          args.title,
          args.description
        ];
        const result = await client.query(sql, values)
        console.log(result.rows[0])
        return result.rows[0]
      }
    }
  }
});

exports.mutation = RootMutation;