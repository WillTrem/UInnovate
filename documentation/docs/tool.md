### Tool Endpoints

#### 1. Retrieve Tools

**Endpoint:** `GET /tools`

Retrieve a list of all tools.

**Request:**

```plaintext
GET /tools
```

**Response:**

```json
[
  {
    "id": 1,
    "tool_type": 1,
    "tool_name": "Drill",
    "tool_price": 25.0,
    "tool_description": "Powerful cordless drill",
    "tool_qty_available": 10
  }
  // ... additional tools
]
```

#### 2. Retrieve Tool by ID

**Endpoint:** `GET /tools/{id}`

Retrieve details for a specific tool.

**Request:**

```plaintext
GET /tools/{id}
```

**Response:**

```json
{
  "id": 1,
  "tool_type": 1,
  "tool_name": "Drill",
  "tool_price": 25.0,
  "tool_description": "Powerful cordless drill",
  "tool_qty_available": 10
}
```

#### 3. Create Tool

**Endpoint:** `POST /tools`

Create a new tool.

**Request:**

```plaintext
POST /tools
```

```json
{
  "tool_type": 1,
  "tool_name": "Circular Saw",
  "tool_price": 40.0,
  "tool_description": "Heavy-duty circular saw",
  "tool_qty_available": 15
}
```

**Response:**

```json
{
  "id": 2,
  "tool_type": 1,
  "tool_name": "Circular Saw",
  "tool_price": 40.0,
  "tool_description": "Heavy-duty circular saw",
  "tool_qty_available": 15
}
```

#### 4. Update Tool by ID

**Endpoint:** `PUT /tools/{id}`

Update details for a specific tool.

**Request:**

```plaintext
PUT /tools/{id}
```

```json
{
  "tool_price": 45.0
}
```

**Response:**

```json
{
  "id": 2,
  "tool_type": 1,
  "tool_name": "Circular Saw",
  "tool_price": 45.0,
  "tool_description": "Heavy-duty circular saw",
  "tool_qty_available": 15
}
```

#### 5. Delete Tool by ID

**Endpoint:** `DELETE /tools/{id}`

Delete a tool.

**Request:**

```plaintext
DELETE /tools/{id}
```

**Response:**

```json
{
  "message": "Tool deleted successfully."
}
```

### Unit Endpoints

#### 1. Retrieve Units

**Endpoint:** `GET /units`

Retrieve a list of all units.

**Request:**

```plaintext
GET /units
```

**Response:**

```json
[
  {
    "unit_id": 1,
    "id": 1,
    "tool_type": 1,
    "unit_serial_number": "SN123456",
    "unit_weight": 12.5,
    "unit_height": 8.0,
    "unit_condition": "Good",
    "unit_available": true,
    "unit_last_exited_date": "2023-11-14T14:30:00Z",
    "unit_last_returned_date": "2023-11-15T10:00:00Z",
    "last_calibration_certificate_id": 1
  }
  // ... additional units
]
```

#### 2. Retrieve Unit by ID

**Endpoint:** `GET /units/{unit_id}`

Retrieve details for a specific unit.

**Request:**

```plaintext
GET /units/{unit_id}
```

**Response:**

```json
{
  "unit_id": 1,
  "id": 1,
  "tool_type": 1,
  "unit_serial_number": "SN123456",
  "unit_weight": 12.5,
  "unit_height": 8.0,
  "unit_condition": "Good",
  "unit_available": true,
  "unit_last_exited_date": "2023-11-14T14:30:00Z",
  "unit_last_returned_date": "2023-11-15T10:00:00Z",
  "last_calibration_certificate_id": 1
}
```

#### 3. Create Unit

**Endpoint:** `POST /units`

Create a new unit.

**Request:**

```plaintext
POST /units
```

```json
{
  "id": 2,
  "tool_type": 1,
  "unit_serial_number": "SN789012",
  "unit_weight": 18.0,
  "unit_height": 10.0,
  "unit_condition": "Excellent",
  "unit_available": true,
  "unit_last_exited_date": "2023-11-16T09:45:00Z",
  "unit_last_returned_date": "2023-11-17T11:30:00Z",
  "last_calibration_certificate_id": 2
}
```

**Response:**

```json
{
  "unit_id": 2,
  "id": 2,
  "tool_type": 1,
  "unit_serial_number": "SN789012",
  "unit_weight": 18.0,
  "unit_height": 10.0,
  "unit_condition": "Excellent",
  "unit_available": true,
  "unit_last_exited_date": "2023-11-16T09:45:00Z",
  "unit_last_returned_date": "2023-11-17T11:30:00Z",
  "last_calibration_certificate_id": 2
}
```

#### 4. Update Unit by ID

**Endpoint:** `PUT /units/{unit_id}`

Update details for a specific unit.

**Request:**

```plaintext
PUT /units/{unit_id}
```

```json
{
  "unit_condition": "Like New"
}
```

**Response:**

```json
{
  "unit_id": 2,
  "id": 2,
  "tool_type": 1,
  "unit_serial_number": "SN789012",
  "unit_weight": 18.0,
  "unit_height": 10.0,
  "unit_condition": "Like New",
  "unit_available": true,
  "unit_last_exited_date": "2023-11-16T09:45:00Z",
  "unit_last_returned_date": "2023-11-17T11:30:00Z",
  "last_calibration_certificate_id": 2
}
```

#### 5. Delete Unit by ID

**Endpoint:** `DELETE /units/{unit_id}`

Delete a unit.

**Request:**

```plaintext
DELETE /units/{unit_id}
```

**Response:**

```json
{
  "message": "Unit deleted successfully."
}
```
