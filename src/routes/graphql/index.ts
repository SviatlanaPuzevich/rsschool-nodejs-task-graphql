import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './graphql-types/schema.js';
import depthLimit from 'graphql-depth-limit';

const maxDepth = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query } = req.body;
      const documentAST = parse(query);
      const validationErrors = validate(schema, documentAST, [depthLimit(maxDepth)]);
      if (validationErrors.length > 0) {
        return reply.status(400).send({
          errors: validationErrors.map((e) => ({ message: e.message })),
        });
      }

      return graphql({
        schema,
        source: req.body.query,
        contextValue: {
          prisma: prisma,
        },
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
