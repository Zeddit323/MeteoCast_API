# MeteoCast API ⛅

API for my frontend weather app for user authentication and favorite cities management (addition and deletion).

## Base URL 🔗

```
http://localhost:<PORT>
```

> The port is configured in your `.env` file.

## Authentication 🛡️

This API does not require an API key. Authentication is handled via **cookies** - once logged in, the session cookie is attached automatically to subsequent requests.

- Cookies expire in **24 hours**
- Most routes are protected and require the user to be logged in
- Reset password tokens expire in **15 minutes**

## Rate limit ⏳

**100 requests per 15 minutes** per IP. Exceeding this limit will result in a `429 Too Many Requests` response.

---

## Endpoints 📍

### Auth

#### `POST /register`
Creates a new user account.

**Body**
| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | User's email |
| password | string | Yes | User's password |

**Responses**

| Status | Meaning |
|---|---|
| 201 | Account created |
| 400 | Invalid input or lack of it |
| 403 | User must log out first |
| 409 | Email already in use |

---

#### `POST /login`
Logs in an existing user and sets a session cookie.

**Body**
| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | User's email |
| password | string | Yes | User's password |

**Responses**

| Status | Meaning |
|---|---|
| 200 | Logged in, cookie set |
| 400 | Invalid input or lack of it |
| 401 | Invalid credentials |

---

#### `POST /forgot-password`
Sends a password reset link to the user's email.

**Body**
| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | User's email |

**Responses**

| Status | Meaning |
|---|---|
| 200 | Reset email sent |
| 400 | Invalid input or lack of it |
| 403 | User must log out first |

---

#### `PATCH /reset-password/:token`
Resets the user's password using the token from the reset email. Sends a confirmation email on succes. Token expires in **15 minutes**.

**URL Parameters**
| Parameter | Type | Description |
|---|---|---|
| token | string | Token from the reset link |

**Body**
| Field | Type | Required | Description |
|---|---|---|---|
| password | string | Yes | User's password |

**Responses**

| Status | Meaning |
|---|---|
| 200 | Password reset successful |
| 400 | Invalid input or lack of it |
| 401 | Token is invalid or expired |
| 403 | User must log out first |

---

#### `POST /logout`
Logs out the current user and clears the session cookie. Requires the user to be logged in.

**Responses**

| Status | Meaning |
|---|---|
| 200 | Logged out |
| 401 | Not logged in |

---

#### `DELETE /delete-account`
Permanently deletes the user's account and sends a confirmation email. Requires the user to be logged in.

**Responses**

| Status | Meaning |
|---|---|
| 200 | Account deleted, email sent |
| 401 | Not logged in |
| 404 | No user found to delete |

---

### Cities

#### `GET /`
Returns all cities in the database.

**Responses**

| Status | Meaning |
|---|---|
| 200 | List of all cities |

---

#### `GET /me`
Returns all cities saved by the logged-in user. Requires the user to be logged in.

**Responses**

| Status | Meaning |
|---|---|
| 200 | List of user's cities |
| 401 | Not logged in |

---

#### `POST /me`
Adds a city to the user's saved cities. If the city does not exist in the database, it is created. Requires the user to be logged in.

**Body**

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | City's name |
| latitude | number | Yes | City's latitude |
| longitude | number | Yes | City's longitude |

**Responses**

| Status | Meaning |
|---|---|
| 200 | City added |
| 400 | Invalid input or lack of it |
| 401 | Not logged in |

---

#### `GET /me/:cityId`
Returns a single city from the user's saved cities. Requires the user to be logged in.

**URL Parameters**
| Parameter | Type | Description |
|---|---|---|
| cityId | number | The city ID |

**Responses**

| Status | Meaning |
|---|---|
| 200 | City data |
| 401 | Not logged in |
| 404 | City not found |

---

#### `DELETE /me/:cityId`
Removes a city from the user's saved cities. Requires the user to be logged in.

**URL Parameters**
| Parameter | Type | Description |
|---|---|---|
| cityId | number | The city ID |

**Responses**

| Status | Meaning |
|---|---|
| 200 | City removed |
| 401 | Not logged in |
| 404 | City not found |

---

## Error Format ⚠️

All errors follow this structure:

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

## Common Error Codes ⛔

| Code | Meaning |
|---|---|
| 400 | Bad request / invalid input |
| 401 | Not logged in |
| 404 | Resource not found |
| 403 | Forbidden |
| 409 | Conflict |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
