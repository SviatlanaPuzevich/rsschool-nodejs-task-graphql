import { GraphQLSchema } from "graphql";
import { RootQueryType } from "./query.js";

export const schema = new GraphQLSchema({
    query: RootQueryType,
});