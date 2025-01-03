## Assumptions

During the development of this project, several assumptions were made. This page summarizes the most significant ones.

### Wrapped APIs

The wrapped API behind the basic `GET /trips` is a potential weak point in terms of performance. The service depends on an external API, which should not be called synchronously. However, based on the endpoint definition, I assumed that the API must be called in real time to deliver the expected results.

To mitigate the coupling with the background service and improve the application's scalability, I recommend discussing the addition of a caching layer (e.g., in-memory, Redis, or similar) in front of the HTTP call. I chose not to implement a caching system directly because the API response includes fields that may change frequently (e.g., trip cost or duration).

### Manager APIs

The basic manager APIs rely on a PostgreSQL database configuration. While the database setup process should be straightforward if you follow the instructions in the README, it still requires some initial configuration. I opted to implement a persistent system with a complete database example, as I believe it provides a better real-world demonstration compared to alternatives like an in-memory database or SQLite.

### No authentication

Due to the nature of this project, I did not implement any authentication method. Basic authentication is insufficient for covering the entire application’s behavior because it lacks user identification. Consequently, any user with the same authentication token would have unrestricted access to the entire database.
To address this, a more advanced security system should be implemented to identify users and restrict CRUD operations to their own data. However, since implementing a comprehensive security system is beyond the scope of this demo project, I chose to leave it for future development.