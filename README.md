# Trip planner service 
This project is a demo implementation of a trip planner REST APIs using the following environment:

- **node**: 22.x.x
- **typescript**: 5.x.x
- **fastify**: 5.x.x
- **postgres**: latest

The service wraps a demo api which produces trip solutions between a fixed set of origin and destionation.

## Usage

The service runs using a Node.js instance. First, you need to define environment variables (see the Environment Variables section for an updated list).
The easiest way to define the environment is to create a `.env` file by copying the provided `.env.example` file. You need to adjust variables.
Using one of the embedded docker-compose files, you have to **replace only** `TRIP_API_URL` and `TRIP_API_KEY` values.
After that, choose your run method.

### Local run

You could execute the service in your local environment using the fastify-cli bundled within the project dependencies.

Ensure to have nodejs version 22 installed. In order to make the execution easier, a ```.nvmrc``` file is included. Install the nvm tool and then execute:

```
nvm use
```

Remember to install project dependencies using:

```
npm install
```

You're ready to start. There are multiple npm task that will start your service.

- Use the *dev* task to start a local instance with code live reloading support:

```
npm run dev
```


- Use the *debug* task to start a local instance with debugging enabled:

```
npm run debug
```

Note: The debug session has no live reload. A VSCode debug configuration is included in the repository, so debugging should be ready to start. Simply import the `.vscode/launch.json` config and attach the remote debugger to the live session.

After the start up, the server will be available under the 3000 port. A generated swagger should be
reachable [here](http://localhost:3000/swagger) (see the swagger section for more details).

At this point, probably you're getting a db connection error. You need a running postgres instance in order to use this microservice. The easiest way to bootstrap a ready-to-use instance is using the embedded `./local-env/docker-compose-base.yml` file. Supposing to have a running docker daemon on your machine, you can start it with:

```
docker-compose -f ./local-env/docker-compose-base.yml up -d
```

Your `.env` file generated from the `.env.example` should be ready to connect to this postgres instance.

### Docker run

A Dockerfile file is included in the repository. You could build a docker image starting from it and then run within any active docker instance. Remember to setup the environment variables before starting.

For testing purpose, an all in one docker compose in provided (the `./local-env/docker-compose-full.yml` file). This file contains a reference to the microservice Dockerfile plus a postgres instance. The environment variables for the db connection are already setted up, so you have to create a *.env* containing only the `TRIP_API_URL` and `TRIP_API_KEY` variables. You could also use the same *.env* file of the local run section, the db variables are ignored.

In order to run the all in one setup, start from the project root directory and use:

```
docker compose -f ./local-env/docker-compose-full.yml --env-file .env up -d
```

The very first time you issue the command, the service image will be built. When you make any change to the codebase, you need to force the image rebuild with:

```
docker compose -f ./local-env/docker-compose-full.yml --env-file .env up -d --build
```

### Test

The project test suite is implemented using jest. Follow the "local run" guidelines in order to create a working local setup (*nvm use + npm i*), then run the test suite using:

```
npm run test
```

### Lint

A lint ruleset is provided with eslint.
You can run the lint task with:

```
npm run lint
```

When a lint rule is violated, eslint could try to fix automatically with:

```
npm run lint:fix
```

Linking the IDE formatter with eslint config is highly suggested.

## Enviroment variables

Here's a formatted Markdown table for your environment variables:

| Name | Description | Values | Default Value | Mandatory |
|------|-------------|---------|---------------|-----------|
| LOG_LEVEL | The logger log level | A valid log level string | `warn` | No |
| TRIP_API_URL | The base url of the wrapped trip api. It will be concatenated with the "/default/trips" path | A valid string | - | Yes |
| TRIP_API_KEY | The api key required for interacting with the wrapped trip api | A valid string | - | Yes |
| DB_HOST | The postgres db url | A valid string | - | Yes |
| DB_PORT | The postgres db connection port | A valid string | - | Yes |
| DB_NAME | The db name | A valid string | - | Yes |
| DB_USERNAME | The db username required for login. Note that the user needs permissions for table creation | A valid string | - | Yes |
| DB_PASSWORD | The db user password | A valid string | - | Yes |

## Swagger

The project deploys a swagger at ```${BASE_URL}/swagger``` path. You can test the APIs using it, it's a fully functional swagger instance.
The swagger is dinamically generated from the json schemas definition under ```./src/model/schemas/``` directory. Every route uses the schema for speeding up serialization and deserialization, so a schema should always be defined.

Check the [fastify plugin](https://github.com/fastify/fastify-swagger) for more info.

