# API Endpoints Documentation

## Services Endpoints

### GET /api/services

Fetch all services from the database.

- **Authentication:** Not required
- **Response:** Array of all services
- **Status Codes:** 200 (success), 500 (server error)

### GET /api/services/:id

Fetch a specific service by ID.

- **Authentication:** Not required
- **Parameters:** `id` - Service ID
- **Response:** Service object
- **Status Codes:** 200 (success), 404 (not found), 500 (server error)

### GET /api/businesses/:id/services

Fetch all services belonging to a specific business.

- **Authentication:** Required
- **Parameters:** `id` - Business ID
- **Response:** Array of services for that business
- **Status Codes:** 200 (success), 500 (server error)

### POST /api/businesses/:id/services

Create a new service for a business.

- **Authentication:** Required
- **Parameters:** `id` - Business ID (must match authenticated user's business)
- **Request Body:**
  ```json
  {
  	"title": "string (required)",
  	"content": "string (required)",
  	"location": "string (required)",
  	"price": "number (required)",
  	"tags": "string (optional)",
  	"img_url": "string (optional)",
  	"tag_id": "number (optional)"
  }
  ```
- **Response:** Created service object with generated ID
- **Status Codes:** 201 (created), 400 (validation error or unauthorized business), 403 (unauthorized user), 500 (server error)

### PATCH /api/services/:id

Update a service (only fields provided will be updated).

- **Authentication:** Required (must own the service's business)
- **Parameters:** `id` - Service ID
- **Request Body:** Any combination of updatable fields:
  ```json
  {
  	"title": "string (optional)",
  	"content": "string (optional)",
  	"location": "string (optional)",
  	"price": "number (optional)",
  	"tags": "string (optional)",
  	"img_url": "string (optional)"
  }
  ```
- **Note:** `tag_id` and `business_id` cannot be edited
- **Response:** Updated service object
- **Status Codes:** 200 (success), 400 (no fields to update), 404 (not found or unauthorized), 500 (server error)

### DELETE /api/services/:id

Delete a service.

- **Authentication:** Required (must own the service's business)
- **Parameters:** `id` - Service ID
- **Response:** Success message with deleted service ID
- **Status Codes:** 200 (success), 404 (not found or unauthorized), 500 (server error)

---

## Businesses Endpoints

### GET /api/businesses

Fetch all businesses from the database.

- **Authentication:** Not required
- **Response:** Array of all businesses
- **Status Codes:** 200 (success), 500 (server error)

### GET /api/businesses/:id

Fetch a specific business by ID.

- **Authentication:** Not required
- **Parameters:** `id` - Business ID (auth_user_id)
- **Response:** Business object
- **Status Codes:** 200 (success), 404 (not found), 500 (server error)

### PATCH /api/businesses/:id

Update a business (only fields provided will be updated).

- **Authentication:** Required (must own the business)
- **Parameters:** `id` - Business ID (auth_user_id)
- **Request Body:** Any combination of updatable fields:
  ```json
  {
  	"name": "string (optional)",
  	"phone": "string (optional)",
  	"is_remote": "boolean (optional)",
  	"location": "string (optional)"
  }
  ```
- **Response:** Updated business object
- **Status Codes:** 200 (success), 400 (no fields to update), 404 (not found or unauthorized), 500 (server error)

---

## Authorization

- Endpoints marked as "Required" use the `requireAuth` middleware
- Service and business modifications can only be performed by authenticated owners
- Both read and write operations use the same ID in the WHERE clause to prevent information leakage (returns 404 for both non-existent and unauthorized resources)
