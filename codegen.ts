import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:5005/graphql',
  documents: ['app/**/*.tsx', 'app/**/*.ts', 'services/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './graphql/': {
      preset: 'client',
      config: {
        documentMode: 'string',
      },
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
