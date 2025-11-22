import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLContext } from './context.js';
import { UserType } from './types/User.js';
import { CreateUserInput } from './inputs/CreateUserInput.js';
import { ProfileType } from './types/Profile.js';
import { CreateProfileInput } from './inputs/CreateProfileInput.js';
import { CreatePostInput } from './inputs/CreatePostInput.js';
import { PostType } from './types/Post.js';
import { UUIDType } from './types/uuid.js';
import { ChangePostInput } from './inputs/ChangePostInput.js';
import { ChangeProfileInput } from './inputs/ChangeProfileInput.js';
import { ChangeUserInput } from './inputs/ChangeUserInput.js';

interface CreateUserArgs {
  dto: {
    name: string;
    balance: number;
  };
}

interface CreateProfileArgs {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
  };
}

interface CreatePostArgs {
  dto: {
    title: string;
    content: string;
    authorId: string;
  };
}

interface ChangePostArgs {
  dto: {
    title: string;
    content: string;
  };
  id: string;
}

interface ChangeProfileArgs {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
  id: string;
}

interface ChangeUserArgs {
  dto: {
    name: string;
    balance: number;
  };
  id: string;
}

interface DeleteArgs {
  id: string;
}

interface SubscribeArgs {
  userId: string;
  authorId: string;
}

export const MutationType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'mutation',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_src, args: CreateUserArgs, context) => {
        return context.prisma.user.create({
          data: {
            name: args.dto.name,
            balance: args.dto.balance,
          },
        });
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_src, args: CreateProfileArgs, context) => {
        return context.prisma.profile.create({
          data: {
            isMale: args.dto.isMale,
            yearOfBirth: args.dto.yearOfBirth,
            memberTypeId: args.dto.memberTypeId,
            userId: args.dto.userId,
          },
        });
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_src, args: CreatePostArgs, context) => {
        return context.prisma.post.create({
          data: {
            title: args.dto.title,
            content: args.dto.content,
            authorId: args.dto.authorId,
          },
        });
      },
    },
    changePost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(ChangePostInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: ChangePostArgs, context) => {
        console.log('ARGS:', args);
        return context.prisma.post.update({
          where: {
            id: args.id,
          },
          data: {
            title: args.dto.title,
            content: args.dto.content,
          },
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: ChangeProfileArgs, context) => {
        return context.prisma.profile.update({
          where: {
            id: args.id,
          },
          data: {
            isMale: args.dto.isMale,
            yearOfBirth: args.dto.yearOfBirth,
            memberTypeId: args.dto.memberTypeId,
          },
        });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: ChangeUserArgs, context) => {
        return context.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            name: args.dto.name,
            balance: args.dto.balance,
          },
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: DeleteArgs, context) => {
        const deletedUser = await context.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
        return deletedUser.id;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: DeleteArgs, context) => {
        const deletedProfile = await context.prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
        return deletedProfile.id;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: DeleteArgs, context) => {
        const deletedPost = await context.prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return deletedPost.id;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: SubscribeArgs, context) => {
        const createdSubs = await context.prisma.subscribersOnAuthors.create({
          data: {
            authorId: args.authorId,
            subscriberId: args.userId,
          },
        });
        return createdSubs.authorId;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(UUIDType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: SubscribeArgs, context) => {
        const deletedSubs = await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              authorId: args.authorId,
              subscriberId: args.userId
            }
          }
        });
        return deletedSubs.authorId
      },
    },
  }),
});
