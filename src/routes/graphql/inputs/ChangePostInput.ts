// input ChangePostInput {
//     title: String
//     content: String
// }

import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
