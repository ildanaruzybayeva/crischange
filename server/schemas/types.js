const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
} = graphql;
const { Client } = require('pg');

const client = new Client();
client.connect();

const UserType = new GraphQLObjectType({
    name: 'User',
    type: 'Query',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        profiles: { type: ProfileType },
        profiles_fields: { type: ProfileFieldsType },
    }),
});

const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    type: 'Query',
    fields: () => ({
        user_id: { type: UserType },
        birth_date: { type: GraphQLString },
        postal_code: { type: GraphQLInt },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
    }),
});

const ProfileFieldsType = new GraphQLObjectType({
    name: 'Profile_Fields',
    type: 'Query',
    fields: () => ({
        user_id: { type: GraphQLID },
        name: { type: GraphQLString },
        value: { type: GraphQLString },
    }),
});

exports.UserType = UserType;
exports.ProfileType = ProfileType;
