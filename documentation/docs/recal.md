### Recalibration Flag Endpoints

#### 1. Retrieve Recalibration Flags

**Endpoint:** `GET /recalibration_flags`

Retrieve a list of all recalibration flags.

**Request:**

```plaintext
GET /recalibration_flags
```

**Response:**

```json
[
  {
    "unit_recalibration_flag_id": 1,
    "unit_id": 1,
    "unit_recalibration_status_id": 1,
    "flag_date": "2023-11-14T12:00:00Z",
    "manual_flagger": true,
    "flagger_name": "John Doe"
  },
  // ... additional recalibration flags
]
```

#### 2. Retrieve Recalibration Flag by ID

**Endpoint:** `GET /recalibration_flags/{flag_id}`

Retrieve details for a specific recalibration flag.

**Request:**

```plaintext
GET /recalibration_flags/{flag_id}
```

**Response:**

```json
{
  "unit_recalibration_flag_id": 1,
  "unit_id": 1,
  "unit_recalibration_status_id": 1,
  "flag_date": "2023-11-14T12:00:00Z",
  "manual_flagger": true,
  "flagger_name": "John Doe"
}
```

#### 3. Create Recalibration Flag

**Endpoint:** `POST /recalibration_flags`

Create a new recalibration flag.

**Request:**

```plaintext
POST /recalibration_flags
```

```json
{
  "unit_id": 1,
  "unit_recalibration_status_id": 1,
  "flag_date": "2023-11-15T12:00:00Z",
  "manual_flagger": false,
  "flagger_name": "Jane Doe"
}
```

**Response:**

```json
{
  "unit_recalibration_flag_id": 2,
  "unit_id": 1,
  "unit_recalibration_status_id": 1,
  "flag_date": "2023-11-15T12:00:00Z",
  "manual_flagger": false,
  "flagger_name": "Jane Doe"
}
```

#### 4. Update Recalibration Flag by ID

**Endpoint:** `PUT /recalibration_flags/{flag_id}`

Update details for a specific recalibration flag.

**Request:**

```plaintext
PUT /recalibration_flags/{flag_id}
```

```json
{
  "manual_flagger": true
}
```

**Response:**

```json
{
  "unit_recalibration_flag_id": 2,
  "unit_id": 1,
  "unit_recalibration_status_id": 1,
  "flag_date": "2023-11-15T12:00:00Z",
  "manual_flagger": true,
  "flagger_name": "Jane Doe"
}
```

#### 5. Delete Recalibration Flag by ID

**Endpoint:** `DELETE /recalibration_flags/{flag_id}`

Delete a recalibration flag.

**Request:**

```plaintext
DELETE /recalibration_flags/{flag_id}
```

**Response:**

```json
{
  "message": "Recalibration flag deleted successfully."
}
```

### Calibration Certificate Endpoints

#### 1. Retrieve Calibration Certificates

**Endpoint:** `GET /calibration_certificates`

Retrieve a list of all calibration certificates.

**Request:**

```plaintext
GET /calibration_certificates
```

**Response:**

```json
[
  {
    "unit_calibration_certificate_id": 1,
    "unit_id": 1,
    "certification_date": "2023-11-14T12:00:00Z",
    "recalibration_advised_date": "2023-12-01T12:00:00Z",
    "calibration_signature": "Certified by John Doe"
  },
  // ... additional calibration certificates
]
```

#### 2. Retrieve Calibration Certificate by ID

**Endpoint:** `GET /calibration_certificates/{certificate_id}`

Retrieve details for a specific calibration certificate.

**Request:**

```plaintext
GET /calibration_certificates/{certificate_id}
```

**Response:**

```json
{
  "unit_calibration_certificate_id": 1,
  "unit_id": 1,
  "certification_date": "2023-11-14T12:00:00Z",
  "recalibration_advised_date": "2023-12-01T12:00:00Z",
  "calibration_signature": "Certified by John Doe"
}
```

#### 3. Create Calibration Certificate

**Endpoint:** `POST /calibration_certificates`

Create a new calibration certificate.

**Request:**

```plaintext
POST /calibration_certificates
```

```json
{
  "unit_id": 1,
  "certification_date": "2023-11-15T12:00:00Z",
  "recalibration_advised_date": "2023-12-02T12:00:00Z",
  "calibration_signature": "Certified by Jane Doe"
}
```

**Response:**

```json
{
  "unit_calibration_certificate_id": 2,
  "unit_id": 1,
  "certification_date": "2023-11-15T12:00:00Z",
  "recalibration_advised_date": "2023-12-02T12:00:00Z",
  "calibration_signature": "Certified by Jane Doe"
}
```

#### 4. Update Calibration Certificate by ID

**Endpoint:** `PUT /calibration_certificates/{certificate_id}`

Update details for a specific calibration certificate.

**Request:**

```plaintext
PUT /calibration_certificates/{certificate_id}
```

```json
{
  "calibration_signature": "Certified by John Doe"
}
```

**Response:**

```json
{
  "unit_calibration_certificate_id": 2,
  "unit_id": 1,
  "certification_date": "2023-11-15T12:00:00Z",
  "recalibration_advised_date": "2023-12-02T12:00:00Z",
  "calibration_signature": "Certified by John Doe"
}
```

#### 5. Delete Calibration Certificate by ID

**Endpoint:** `DELETE /calibration_certificates/{certificate_id}`

Delete a calibration certificate.

**Request:**

```plaintext
DELETE /calibration_certificates/{certificate_id}
```

**Response:**

```json
{
  "message": "Calibration certificate deleted successfully."
}
```
