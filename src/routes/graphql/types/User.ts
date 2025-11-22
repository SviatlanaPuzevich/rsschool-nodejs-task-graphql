import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Profile, ProfileType } from './Profile.js';
import { Post, PostType } from './Post.js';
import { UUIDType } from './uuid.js';
import { GraphQLContext } from '../context.js';

export interface User {
  id: string;
  name: string;
  balance: number;
  profile?: Profile;
  posts: Post[];
  userSubscribedTo: User[];
  subscribedToUser: User[];
}


export const UserType: GraphQLObjectType<User, GraphQLContext> =
  new GraphQLObjectType<
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
    posts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, _args, context) => {
        return context.prisma.post.findMany({
          where: { authorId: user.id }
        });
      }
    },
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
