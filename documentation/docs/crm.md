### Contact Endpoints

#### 1. Retrieve Contacts

**Endpoint:** `GET /contacts`

Retrieve a list of all contacts.

**Request:**

```plaintext
GET /contacts
```

**Response:**

```json
[
  {
    "contact_id": 1,
    "company_id": 1,
    "contact_position": "Manager",
    "phone_number": "555-1234",
    "email": "manager@example.com"
  },
  // ... additional contacts
]
```

#### 2. Retrieve Contact by ID

**Endpoint:** `GET /contacts/{contact_id}`

Retrieve details for a specific contact.

**Request:**

```plaintext
GET /contacts/{contact_id}
```

**Response:**

```json
{
  "contact_id": 1,
  "company_id": 1,
  "contact_position": "Manager",
  "phone_number": "555-1234",
  "email": "manager@example.com"
}
```

#### 3. Create Contact

**Endpoint:** `POST /contacts`

Create a new contact.

**Request:**

```plaintext
POST /contacts
```

```json
{
  "company_id": 1,
  "contact_position": "Supervisor",
  "phone_number": "555-5678",
  "email": "supervisor@example.com"
}
```

**Response:**

```json
{
  "contact_id":
```
