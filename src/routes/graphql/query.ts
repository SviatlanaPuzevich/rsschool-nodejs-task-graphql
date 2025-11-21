import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { UserType } from './types/User.js';
import { ProfileType } from './types/Profile.js';
import { PostType } from './types/Post.js';
import { MemberTypeGraphType, MemberTypeIdEnum } from './types/MemberType.js';
import { GraphQLContext } from './context.js';
import { UUIDType } from './types/uuid.js';

export const RootQueryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'RootQueryType',
  fields: () => ({
    memberType: {
      type: MemberTypeGraphType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: (_src, args: { id: string }, context) => {
        return context.prisma.memberType.findFirst({
          where: {
            id: args.id,
          },
        });
      },
    },
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeGraphType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.memberType.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_src, args: { id: string }, context) => {
        return context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            profile: true,
            posts: true,
            userSubscribedTo: {
              include: {
                author: true,
              },
            },
            subscribedToUser: {
              include: {
                subscriber: true,
              }
            }
          },
        }) ?? null;
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.user.findMany({
          include: {
            profile: true,
            posts: true,
            userSubscribedTo: {
              include: {
                author: true,
              },
            },
            subscribedToUser: {
              include: {
                subscriber: true,
              }
            }
          },
        });
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_src, args: { id: string }, context) => {
        return context.prisma.post.findFirst({
          where: {
            id: args.id,
          },
        }) ?? null;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.post.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_src, args: { id: string }, context) => {
        return context.prisma.profile.findFirst({
          where: {
            id: args.id,
          },
        }) ?? null;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.profile.findMany();
      },
    },
  }),
});
