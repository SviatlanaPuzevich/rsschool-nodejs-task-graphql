
// type Post {
//     id: UUID!
//     title: String!
//     content: String!
// }

import { PrismaClient } from "@prisma/client";
import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
} from "graphql";
import { UUIDType } from './uuid.js';

export interface Post {
    id: string;
    title: string;
    content: string;
}
export interface GraphQLContext {
    prisma: PrismaClient;
}

export const PostType = new GraphQLObjectType<Post, GraphQLContext>({
    name: "Post",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
    }),
});