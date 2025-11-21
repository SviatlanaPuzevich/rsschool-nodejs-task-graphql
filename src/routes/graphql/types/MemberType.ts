import { PrismaClient } from '@prisma/client';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInt,
} from 'graphql';

export enum MemberTypeId {
  BASIC,
  BUSINESS,
}

export interface MemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export interface GraphQLContext {
  prisma: PrismaClient;
}

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberTypeGraphType = new GraphQLObjectType<MemberType, GraphQLContext>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
