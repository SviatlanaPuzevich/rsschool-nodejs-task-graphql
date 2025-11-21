import { PrismaClient } from '@prisma/client';
import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt, GraphQLBoolean,
} from 'graphql';
import { MemberType, MemberTypeGraphType } from './MemberType.js';
import {UUIDType} from "./uuid.js";


export interface Profile {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    memberType: MemberType;
}

export interface GraphQLContext {
    prisma: PrismaClient;
}


export const ProfileType = new GraphQLObjectType<Profile, GraphQLContext>({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: { type: new GraphQLNonNull(MemberTypeGraphType) },
    }),
});