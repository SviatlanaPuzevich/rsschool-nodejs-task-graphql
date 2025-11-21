import { PrismaClient } from '@prisma/client';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { Profile, ProfileType } from './Profile.js';
import { Post, PostType } from './Post.js';
import { UUIDType } from './uuid.js';

export interface User {
  id: string;
  name: string;
  balance: number;
  profile?: Profile;
  posts: Post[];
  userSubscribedTo: User[];
  subscribedToUser: User[];
}

export interface GraphQLContext {
  prisma: PrismaClient;
}

export const UserType: GraphQLObjectType<User, GraphQLContext> =
  new GraphQLObjectType<User, GraphQLContext>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: ProfileType },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))) },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
  }),
});
