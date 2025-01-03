## Technical Extra Information

This page briefly describes some of the technical choices made in this project.

### Framework

I chose Fastify as the main framework for this microservice because of its simplicity. It helps bootstrap a fully working example in a short time while providing all the tools required for scaling up in complexity.

The main focuses of Fastify are performance and plugin architecture. I limited the imports to the most important plugins to give a good example of a scalable microservice.

### Error handling

As you can see in the project, there are many references to a custom error implementation (`ApiError` class). Using this throwable element in combination with a custom Fastify plugin (`../src/plugins/api-errors-handler.ts`), I tried to make error handling smoother, keeping the attention on the best case execution.

### Data layer

The `/manager` endpoints rely on a database implementation. To abstract the real database implementation, I made 2 choices:

- I created a dedicated data layer, where no data item is exported from the repository and where the query function interfaces don't depend on the underlying data model. 
- I opted for the Sequelize ORM library that makes querying very easy and understandable.

### DB connection plugin

The DB connection renewal is handled by a dedicated Fastify plugin (`../src/plugins/db-connect.ts`). This solution automatically establishes and renews the DB connection for each request that points to the `/manager` endpoints. This way, developers don't need to manually call the "connect" function and can focus on the business logic implementation.

### Manager API recap

The **save API** accepts a subset of fields of the real `TripRecord` implementation. This way, critical information like id and system timestamp can't be forced by the user. The owner field is a request field for this testing phase, but once a proper security layer is implemented, it should be fixed to the identified user or to a subset of resources the user is authorized to access.

The **list API** returns the results of a given owner. As before, the owner field should be fixed as explained above. 
The API is paginated by default since the result size could grow very quickly. It returns only the undeleted trips from the database.

The **delete API** is very simple: it performs a logical deletion of the trip record, so only the `deletedAt` field is set.