import DataLoader from 'dataloader';
import { Post } from '../types/Post.js';
import { PrismaClient } from '@prisma/client';
import { Profile } from '../types/Profile.js';
import { MemberType } from '../types/MemberType.js';
import { User } from '../types/User.js';

export const postDataLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Post[]>( async (userIds:  readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...userIds],
        },
      },
    });
    const map = new Map<string, Post[]>();
    userIds.forEach(id => map.set(id, []));
    posts.forEach(post => map.get(post.authorId)!.push(post));
    return userIds.map(id => map.get(id)!);
  });
};

export const profileDataLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, Profile>( async (userIds:  readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });
    const map = new Map<string, Profile>(profiles.map((profile) => [profile.userId, profile]));
    return userIds.map(id => map.get(id)!);
  });
};

export const memberTypeDataLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, MemberType>( async (memberTypeIds:  readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: [...memberTypeIds],
        },
      },
    });
    const map = new Map<string, MemberType>(memberTypes.map((mt) => [mt.id, mt]));
    return memberTypeIds.map(id => map.get(id)!);
  });
};

export const userSubscribedToDataLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>( async (userIds:  readonly string[]) => {
    const authors = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: {
          in: [...userIds],
        },
      },
      include: {
        author: true
      }
    });
    const map = new Map<string, User[]>();
    userIds.forEach(id => map.set(id, []));
    authors.forEach(author => map.get(author.subscriberId)!.push(author.author as User));
    return userIds.map(id => map.get(id)!);
  });
};

export const subscribedToUserDataLoader = (prisma: PrismaClient) => {
  return new DataLoader<string, User[]>( async (userIds:  readonly string[]) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {
          in: [...userIds],
        },
      },
      include: {
        subscriber: true
      }
    });
    const map = new Map<string, User[]>();
    userIds.forEach(id => map.set(id, []));
    subscribers.forEach(subscriber => map.get(subscriber.authorId)!.push(subscriber.subscriber as User));
    return userIds.map(id => map.get(id)!);
  });
};