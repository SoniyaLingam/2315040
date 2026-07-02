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
### Request Body
### Response (201 Created)
# API 4 – Mark Notification as Read
### Endpoint
### Response
# API 5 – Mark All Notifications as Read
### Endpoint
### Response
# API 6 – Delete Notification
### Endpoint
### Response
# API 7 – Get Unread Notification Count
### Endpoint
### Response
# Notification Object Schema
# Standard Error Response
# Real-Time Notification Mechanism
The system uses WebSockets (Socket.IO) for real-time communication.
#Workflow

1. User connects to the WebSocket server after opening the application.
2. A persistent connection is established.
3. Whenever a new notification is created, the backend emits a `new_notification` event.
4. Connected clients instantly receive the notification without refreshing the page.
5. The frontend updates the notification list and unread count in real time.

This approach provides a better user experience for campus notifications.

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