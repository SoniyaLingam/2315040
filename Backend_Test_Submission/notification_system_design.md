# Stage 1

# Notification System REST API Design

## Overview

The Notification System enables students to receive real-time updates regarding Placements, Results, and Events. The APIs are designed following REST principles with predictable endpoint naming, consistent request/response formats, and support for pagination and filtering. Real-time notifications are delivered using WebSockets.

## Core Actions Supported

- Create Notification
- Get All Notifications
- Get Notification by ID
- Mark Notification as Read
- Mark All Notifications as Read
- Delete Notification
- Get Unread Notification Count
- Receive Real-Time Notifications

# Common Request Headers

| Header | Value |
|---------|-------|
| Authorization | Bearer \<token> |
| Content-Type | application/json |
| Accept | application/json |


# API 1 – Get All Notifications

### Endpoint

```http
GET /api/v1/notifications
```

### Query Parameters

| Parameter | Type | Description |
|----------|------|-------------|
| page | Integer | Page number |
| limit | Integer | Number of records |
| type | String | Placement / Result / Event |
| isRead | Boolean | Read status |

### Example Request

```http
GET /api/v1/notifications?page=1&limit=10&type=Placement
```

### Response (200 OK)

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 52,
  "notifications": [
    {
      "id": "1",
      "title": "Amazon Hiring",
      "message": "Amazon is hiring Software Engineers.",
      "type": "Placement",
      "priority": "High",
      "isRead": false,
      "createdAt": "2026-07-02T10:00:00Z"
    }
  ]
}
```

# API 2 – Get Notification by ID

### Endpoint

```http
GET /api/v1/notifications/{id}
```

### Response

```json
{
  "success": true,
  "notification": {
    "id": "1",
    "title": "Amazon Hiring",
    "message": "Amazon is hiring Software Engineers.",
    "type": "Placement",
    "priority": "High",
    "isRead": false,
    "createdAt": "2026-07-02T10:00:00Z"
  }
}
```

# API 3 – Create Notification

### Endpoint

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "title": "Amazon Hiring",
  "message": "Amazon is hiring Software Engineers.",
  "type": "Placement",
  "priority": "High"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

# API 4 – Mark Notification as Read

### Endpoint

```http
PATCH /api/v1/notifications/{id}/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

# API 5 – Mark All Notifications as Read

### Endpoint

```http
PATCH /api/v1/notifications/read-all
```

### Response

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

# API 6 – Delete Notification

### Endpoint

```http
DELETE /api/v1/notifications/{id}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

# API 7 – Get Unread Notification Count

### Endpoint

```http
GET /api/v1/notifications/unread-count
```

### Response

```json
{
  "success": true,
  "count": 8
}
```
# Notification Object Schema

```json
{
  "id": "UUID",
  "title": "string",
  "message": "string",
  "type": "Placement | Result | Event",
  "priority": "High | Medium | Low",
  "isRead": false,
  "createdAt": "ISO-8601 Timestamp"
}
```

# Standard Error Response

```json
{
  "success": false,
  "message": "Notification not found",
  "errorCode": "NOTIFICATION_NOT_FOUND"
}
```

Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |


# Real-Time Notification Mechanism

The system uses WebSockets (Socket.IO) for real-time communication.

### Workflow

1. User connects to the WebSocket server after opening the application.
2. A persistent connection is established.
3. Whenever a new notification is created, the backend emits a `new_notification` event.
4. Connected clients instantly receive the notification without refreshing the page.
5. The frontend updates the notification list and unread count in real time.

This approach provides better user experience for campus notifications.

# Stage 2

## Database Schema

The notification system stores notification details and read status separately to improve scalability and avoid duplicate data.

### Table: notifications

| Column | Type | Description |
|--------|------|-------------|
| notification_id | UUID | Primary Key |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification content |
| type | ENUM | Placement, Result, Event |
| priority | ENUM | High, Medium, Low |
| created_at | TIMESTAMP | Creation time |

### Table: users

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Primary Key |
| name | VARCHAR(100) | Student name |
| email | VARCHAR(150) | Student email |

### Table: user_notifications

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | Foreign Key |
| notification_id | UUID | Foreign Key |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMP | Time when notification was read |

## Relationships

- One notification can be sent to many users.
- One user can receive many notifications.
- The `user_notifications` table acts as the mapping table.

## Indexes

- Index on user_id
- Index on notification_id
- Composite index on (user_id, is_read)

# Stage 3

## Query Optimization

To improve database performance, the following optimization techniques are used:

- Create an index on `user_id` to quickly retrieve notifications for a user.
- Create an index on `notification_id` for faster notification lookups.
- Use a composite index on (`user_id`, `is_read`) to efficiently fetch unread notifications.
- Implement pagination using `LIMIT` and `OFFSET` to avoid loading all records.
- Retrieve only required columns instead of using `SELECT *`.
- Archive or remove old notifications periodically to reduce table size.

## Optimized Query Example

```sql
SELECT n.notification_id,
       n.title,
       n.message,
       n.type,
       n.priority,
       un.is_read,
       n.created_at
FROM notifications n
JOIN user_notifications un
ON n.notification_id = un.notification_id
WHERE un.user_id = ?
ORDER BY n.created_at DESC
LIMIT 10 OFFSET 0;
```

# Stage 4

## Performance Improvements

The following techniques improve the scalability and responsiveness of the notification system:

- Use pagination to reduce API response size.
- Store frequently accessed unread counts in cache.
- Add indexes on frequently queried columns.
- Deliver notifications asynchronously using background workers.
- Compress API responses where possible.
- Use database connection pooling.
- Archive old notifications to maintain database performance.

# Stage 5

## Reliable Notification Delivery Workflow

### Workflow

1. A notification request is received from the admin or system.
2. The backend validates the request data.
3. The notification is stored in the `notifications` table.
4. Recipient details are stored in the `user_notifications` table.
5. A background worker processes the notification queue.
6. The notification is delivered to connected users through WebSockets.
7. If the user is offline, the notification remains available when they log in.
8. Any delivery failures are logged using the Logging Middleware for monitoring and debugging.

## Reliability Measures

- Validate all incoming requests.
- Retry failed notification deliveries.
- Log every important operation using the logging middleware.
- Prevent duplicate notifications using unique identifiers.
- Process notifications asynchronously to avoid blocking API requests.