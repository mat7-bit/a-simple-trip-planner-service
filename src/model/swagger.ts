export const SWAGGER_TAGS = {
  'HEALTHCHECK': 'Healthcheck',
}

export const SWAGGER_DEFINITION = {
  info: {
    title: 'Demo trip planner',
    description: 'A simple demo API to plan trips',
    version: '0.0.1-alpha.0',
  },
  externalDocs: {
    url: 'https://swagger.io',
    description: 'Find more info here',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: SWAGGER_TAGS.HEALTHCHECK,
      description: 'Healthcheck endpoints',
    },
  ],
};
