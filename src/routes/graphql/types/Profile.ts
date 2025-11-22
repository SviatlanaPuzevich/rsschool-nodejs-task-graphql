import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeGraphType } from './MemberType.js';
import { UUIDType } from './uuid.js';
import {GraphQLContext} from "../context.js";

export interface Profile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  memberType?: MemberType;
}


export const ProfileType = new GraphQLObjectType<Profile, GraphQLContext>({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: new GraphQLNonNull(MemberTypeGraphType),
            resolve: async (profile, _args, context) => {
                return context.loaders.memberTypeToProfile.load(profile.memberTypeId)
            }
        },
    }),
});