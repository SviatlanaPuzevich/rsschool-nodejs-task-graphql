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

export const UserType: GraphQLObjectType<User, GraphQLContext> = new GraphQLObjectType<
  User,
  GraphQLContext
>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, context) => {
        return context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))) },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: { author: true },
        });
        return subscriptions.map((sub) => sub.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        return subscriptions.map((sub) => sub.subscriber);
      },
    },
  }),
});
