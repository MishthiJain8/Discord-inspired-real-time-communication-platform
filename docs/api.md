# API Documentation

## Authentication

### POST /api/auth/register
Register a new user.

Body:
- username
- email
- password

### POST /api/auth/login
Authenticate user.

Body:
- email
- password

### POST /api/auth/refresh
Rotate refresh token and issue a new access token.

Body:
- refreshToken

### POST /api/auth/logout
Revoke refresh token.

Body:
- refreshToken

## Users

### GET /api/users/me
Get current user profile.

Headers:
- Authorization: Bearer <token>

### PATCH /api/users/me
Update current user profile.

Body:
- username?
- avatarUrl?

## Servers

### POST /api/servers
Create a new server.
Body:
- name
- description?
- isPrivate?

### GET /api/servers
List servers joined by the user.

### GET /api/servers/:serverId
Get server details.

## Channels

### POST /api/servers/:serverId/channels
Create a channel.
Body:
- name
- type (public/private)

### GET /api/servers/:serverId/channels
List channels in a server.

### POST /api/channels/:channelId/join
Join a public channel.

### POST /api/channels/:channelId/leave
Leave a channel.

## Messages

### GET /api/channels/:channelId/messages?page=1&limit=50
Fetch paginated message history.

### POST /api/channels/:channelId/messages
Send a new message.
Body:
- content

## Socket.IO Events

### Client -> Server
- `join_channel` { channelId }
- `leave_channel` { channelId }
- `send_message` { channelId, content }
- `typing` { channelId, isTyping }
- `read_message` { channelId, messageId }

### Server -> Client
- `message_created` { message }
- `channel_typing` { channelId, userId, username }
- `presence_update` { channelId, activeCount }
- `message_read` { channelId, messageId, userId }
- `user_online` { userId }
- `user_offline` { userId }
