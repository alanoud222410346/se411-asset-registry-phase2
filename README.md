# Computer Asset Registry

SE411 project (Fall 2026-27).

A web app to manage the computers of a company.

- **Part 1:** React frontend (`/frontend`)
- **Part 2:** Java Spring Boot server (`/backend`), connected to the frontend

The user can add a computer, search for a computer by id, see all computers with pagination, update a computer and delete a computer. The data is stored in an H2 in-memory database on the server.

## Team

| Name | Student ID |
|---|---|
| Alanoud Almubarak | 222410346 |
| Reema Altamimi | 222410482 |
| Dana Alfaris | 222410460 |

## Project structure

```
se411-asset-registry/
  frontend/   React + Vite app (Part 1, now calling the server)
  backend/    Spring Boot + Maven server (Part 2)
  docs/       requirements, architecture and REST API table
```

## What you need

- Java 21 (JDK)
- Eclipse IDE for Enterprise Java and Web Developers (has Maven built in), or Maven installed
- Node.js (LTS)

## 1. Run the backend

**In Eclipse:** File > Import > Maven > Existing Maven Projects > choose the `backend` folder. Wait for the dependencies to download, then right-click the project > Run As > Spring Boot App (or Run As > Java Application on `AssetRegistryApplication`).

**From a terminal:**

```
cd backend
mvn spring-boot:run
```

The server starts on http://localhost:8080. It adds 8 sample computers at startup from `data.sql`.

You can see the database at http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:assetdb`, user `sa`, no password).

## 2. Run the frontend

Open a second terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The backend must be running at the same time.

## Run the tests

**Backend (JUnit 5 + Mockito):** in Eclipse right-click the project > Run As > JUnit Test, or:

```
cd backend
mvn test
```

**Frontend (Vitest):**

```
cd frontend
npm run test
```

## REST API

| Method | Route | Description | Success | Error |
|---|---|---|---|---|
| POST | /api/assets | Add a computer | 201 Created + the new computer | - |
| GET | /api/assets/{id} | Search a computer by id | 200 OK + the computer | 404 Not Found |
| GET | /api/assets?page=0&size=5 | All computers, one page at a time | 200 OK + page object | - |
| PUT | /api/assets/{id} | Update a computer | 200 OK + the updated computer | 404 Not Found |
| DELETE | /api/assets/{id} | Delete a computer | 204 No Content | 404 Not Found |

More details in [docs/rest-api.md](docs/rest-api.md).

## Docs

- [Requirements (Part 1)](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [REST API](docs/rest-api.md)
- [Presentation (2 slides)](docs/SE411_Part2_Presentation.pptx)
