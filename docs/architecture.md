# Architecture

The system has two parts that run at the same time:

- **Frontend:** a React app (Part 1) that runs in the browser on port 5173.
- **Backend:** a Java Spring Boot server (Part 2) that runs on port 8080 and stores the data in an H2 database.

The frontend talks to the backend with HTTP requests and JSON (a REST API).

## Overall design

```
+---------------------------+          HTTP + JSON          +-------------------------------------------+
|  Browser (port 5173)      |  --------------------------> |  Spring Boot server (port 8080)           |
|                           |                               |                                           |
|  React pages              |                               |  AssetController   (@RestController)     |
|    AssetList, AssetForm,  |                               |        |  calls                           |
|    SearchAsset, About     |                               |        v                                  |
|        |                  |                               |  AssetService      (@Service)            |
|        v                  |                               |        |  calls                           |
|  AssetContext (state)     |                               |        v                                  |
|        |                  |                               |  AssetRepository   (JpaRepository)       |
|        v                  |  <-------------------------- |        |  JPA / Hibernate                 |
|  api/assetApi.js (fetch)  |          JSON response        |        v                                  |
+---------------------------+                               |  H2 in-memory database (table "assets")  |
                                                            +-------------------------------------------+
```

## Tech stack

| Part | Technology |
|---|---|
| Frontend UI | React 19 |
| Frontend build tool | Vite |
| Routing | react-router-dom |
| Frontend state | React Context + useState |
| HTTP calls | fetch |
| Frontend tests | Vitest, React Testing Library |
| Backend language | Java 21 |
| Backend framework | Spring Boot 3.5 (Spring Web, Spring Data JPA) |
| Build tool | Maven |
| Database | H2 (in memory) |
| Backend tests | JUnit 5, Mockito, MockMvc |
| IDEs | VS Code (frontend), Eclipse (backend) |

## Features

- List all computers in a table, 5 per page, with Previous and Next buttons.
- Add a computer with form validation.
- Search a computer by its id.
- Edit a computer using the same form as add.
- Delete a computer with a confirmation message.
- Navigation menu on every page.
- About page with the team members.

## Backend layers

| Layer | Class | Job |
|---|---|---|
| Model | `model/Asset.java` | JPA entity. One row in the `assets` table. Fields: id, name, brand, serialNumber, purchaseDate, price, status. |
| Repository | `repository/AssetRepository.java` | Extends `JpaRepository<Asset, Long>`. Spring Data writes the code for save, findById, findAll(Pageable) and delete. |
| Service | `service/AssetService.java` | The business logic: add, find by id, find all with paging (sorted by id), update and delete. Throws `AssetNotFoundException` when an id does not exist. |
| Controller | `controller/AssetController.java` | The REST routes under `/api/assets`. Calls the service and returns JSON. `@CrossOrigin` lets the React app on port 5173 call it. |
| DTO | `dto/AssetPageResponse.java` | The JSON sent back for the paginated list: content, page, size, totalElements, totalPages. |
| Exception | `exception/AssetNotFoundException.java` | Marked with `@ResponseStatus(NOT_FOUND)` so Spring returns 404. |

Configuration is in `src/main/resources/application.properties`. The 8 sample computers are in `src/main/resources/data.sql` and are added every time the server starts.

### Flow of one request (example: update)

1. The user clicks "Save changes" in the edit form.
2. `AssetForm` calls `updateAsset(id, data)` from `AssetContext`.
3. `assetApi.js` sends `PUT http://localhost:8080/api/assets/{id}` with the asset as JSON.
4. `AssetController.updateAsset` receives it and calls `AssetService.updateAsset`.
5. The service finds the asset with the repository (or throws `AssetNotFoundException`, which becomes 404), copies the new values and saves it.
6. The updated asset goes back as JSON and the app returns to the list, which loads the page again from the server.

## Frontend

### Folder structure

```
frontend/src/
  main.jsx                   starts the app, adds Router and Provider
  App.jsx                    navigation bar and routes
  index.css                  all styles
  api/assetApi.js            fetch calls to the Spring Boot server
  data/assets.js             status options
  context/AssetContext.jsx   state and functions for assets
  components/NavBar.jsx      menu
  pages/AssetList.jsx        table page with pagination
  pages/AssetForm.jsx        add and edit form
  pages/SearchAsset.jsx      search by id page
  pages/About.jsx            team page
  test/                      tests
```

### Component tree

```
BrowserRouter
  AssetProvider
    App
      NavBar
      Routes
        AssetList    (/)
        AssetForm    (/add)
        AssetForm    (/edit/:id)
        SearchAsset  (/search)
        About        (/about)
```

### State management

In Part 1 the data was an array in memory. In Part 2 `AssetProvider` (`src/context/AssetContext.jsx`) keeps only the current page that came from the server.

| Name | What it does |
|---|---|
| assets | The assets on the current page |
| page, totalPages, totalElements | Paging information from the server |
| loading, error | Shown while loading or when the server cannot be reached |
| loadAssets(page) | GET one page from the server |
| addAsset(asset) | POST a new asset |
| updateAsset(id, asset) | PUT the new values |
| deleteAsset(id) | DELETE the asset, then reload the page |
| getAsset(id) | GET one asset by id (returns null if not found) |

## Tests

**Backend** (`backend/src/test`), run with `mvn test` or Run As > JUnit Test in Eclipse:

- `AssetServiceTest` uses Mockito to mock `AssetRepository`. It tests add, find by id (found and not found), find all with paging and sorting, wrong page values, update (found and not found) and delete (found and not found).
- `AssetControllerTest` uses `@WebMvcTest` and MockMvc, with `AssetService` mocked by `@MockitoBean`. It tests every route, the status codes (200, 201, 204, 404) and the JSON returned.
- `AssetRegistryApplicationTests` checks that the Spring application starts.

**Frontend** (`frontend/src/test`), run with `npm run test`. The file `api/assetApi.js` is mocked with `vi.mock`, so the tests do not need the server:

- `AssetList.test.jsx`: loading the list, edit links, delete with confirm and cancel, empty list, pagination, server error.
- `AssetForm.test.jsx`: validation, add, loading in edit mode, saving changes, not found, save error.
- `SearchAsset.test.jsx`: found, not found, empty id, server error.
