import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import {Post} from "./types/Post.js";
import {
    memberTypeDataLoader,
    postDataLoader,
    profileDataLoader,
    subscribedToUserDataLoader,
    userSubscribedToDataLoader
} from "./dataloaders/dataloaders.js";
import {Profile} from "./types/Profile.js";
import {User} from "./types/User.js";
import {MemberType} from "./types/MemberType.js";

export interface GraphQLContext {
    prisma: PrismaClient;
    loaders: Loaders
}

interface Loaders {
    postsByAuthorId: DataLoader<string, Post[]>;
    profileByUserId: DataLoader<string, Profile>;
    authorsBySubscriberId: DataLoader<string, User[]>;
    subscribersByUserId: DataLoader<string, User[]>;
    memberTypeToProfile: DataLoader<string, MemberType>;
}


export function createLoaders(prisma: PrismaClient): Loaders {
    return {
        postsByAuthorId: postDataLoader(prisma),
        profileByUserId: profileDataLoader(prisma),
        authorsBySubscriberId: userSubscribedToDataLoader(prisma),
        subscribersByUserId: subscribedToUserDataLoader(prisma),
        memberTypeToProfile: memberTypeDataLoader(prisma)
    };
}

