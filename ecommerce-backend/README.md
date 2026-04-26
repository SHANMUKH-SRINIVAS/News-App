## Ecommerce Backend

This folder contains a simple multi-module Spring Boot backend for an ecommerce app:

- `auth-service` (port 8081) – user registration and login, issues JWT access tokens.
- `product-service` (port 8082) – basic product catalog APIs.
- `gateway-service` (port 8080) – API gateway that the React frontend talks to.

### How to import in Spring Tool Suite

1. In STS, choose **File → Import → Existing Maven Projects**.
2. Point it to the `ecommerce-backend` folder.
3. Make sure **all modules** are checked and finish the import.

### How to run the services

1. Start MySQL locally and create a user with access:
   - Update `spring.datasource.username` and `spring.datasource.password` in:
     - `auth-service/src/main/resources/application.properties`
     - `product-service/src/main/resources/application.properties`
2. In STS, right-click each of these projects and choose **Run As → Spring Boot App**:
   - `gateway-service` (will listen on `http://localhost:8080`)
   - `auth-service`
   - `product-service`

JPA will auto-create the tables on first run.

