const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
} = require('graphql');
const { UserType, ProfileType } = require('./types');
const client = require('../db');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { email: { type: GraphQLString } },
            resolve: async (parentValue, args) => {
                const sql = `SELECT * FROM users WHERE email = $1`;
                const values = [args.email];
                const result = await client.query(sql, values);
                //console.log(result.rows);
                return result.rows[0];
            },
        },
        profile: {
            type: new GraphQLList(ProfileType),
            args: { user_id: { type: GraphQLID } },
            resolve: async (parentValue, args) => {
                const sql = 'SELECT * FROM profiles WHERE user_id = $1';
                const values = [args.user_id];
                const result = await client.query(sql, values);
                console.log(result.rows);
                return result.rows;
            },
        },
    },
});

exports.query = RootQuery;
