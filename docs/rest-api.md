# REST API

Base URL: `http://localhost:8080/api/assets`

All requests and responses use JSON.

## Routes

| Method | Route | Description | Request body | Response |
|---|---|---|---|---|
| POST | /api/assets | Add a new computer | Asset (without id) | 201 Created, the saved asset with its new id |
| GET | /api/assets/{id} | Search a computer by id | - | 200 OK, the asset / 404 Not Found |
| GET | /api/assets?page={page}&size={size} | Get all computers, paginated and sorted by id | - | 200 OK, page object |
| PUT | /api/assets/{id} | Update a computer | Asset (new values) | 200 OK, the updated asset / 404 Not Found |
| DELETE | /api/assets/{id} | Delete a computer | - | 204 No Content / 404 Not Found |

`page` starts at 0. If `page` or `size` are not sent, the server uses `page=0` and `size=5`.

## Asset JSON

```json
{
  "id": 1,
  "name": "Dell Latitude 5440",
  "brand": "Dell",
  "serialNumber": "DL5440-001",
  "purchaseDate": "2024-02-15",
  "price": 1150.0,
  "status": "In use"
}
```

`status` is one of: `In use`, `In stock`, `In repair`, `Retired`.

## Page JSON (GET /api/assets)

```json
{
  "content": [
    { "id": 1, "name": "Dell Latitude 5440", "brand": "Dell", "serialNumber": "DL5440-001", "purchaseDate": "2024-02-15", "price": 1150.0, "status": "In use" }
  ],
  "page": 0,
  "size": 5,
  "totalElements": 8,
  "totalPages": 2
}
```

## Examples with curl

```
curl -X POST http://localhost:8080/api/assets -H "Content-Type: application/json" -d "{\"name\":\"HP ProBook\",\"brand\":\"HP\",\"serialNumber\":\"HP-77\",\"purchaseDate\":\"2025-03-04\",\"price\":800,\"status\":\"In stock\"}"

curl http://localhost:8080/api/assets/1

curl "http://localhost:8080/api/assets?page=1&size=5"

curl -X PUT http://localhost:8080/api/assets/1 -H "Content-Type: application/json" -d "{\"name\":\"Dell Latitude 5440\",\"brand\":\"Dell\",\"serialNumber\":\"DL5440-001\",\"purchaseDate\":\"2024-02-15\",\"price\":1100,\"status\":\"In repair\"}"

curl -X DELETE http://localhost:8080/api/assets/5
```
