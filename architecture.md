# Architecture Overview

## Core Layers

- `client/` — Vite-powered React SPA with Socket.IO client, optimistic UI, channel navigation, and responsive layout.
- `server/` — Express + TypeScript API server, Socket.IO gateway, service/repository architecture, validation, and centralized error handling.
- `PostgreSQL` — durable message persistence, user data, server/channel membership, permissions.
- `Redis` — caching, distributed session state, and Socket.IO pub/sub adapter for horizontal scaling.

## Key Design Patterns

- Service Layer: business logic in service classes
- Repository Pattern: data access isolated behind repositories
- Stateless Backend: JWT auth, refresh token rotation, no sticky sessions
- Pub/Sub: Redis adapter for Socket.IO broadcast across backend instances

## Data Flow

1. Client authenticates and receives an access token + refresh token.
2. Client joins Socket.IO rooms for servers and channels.
3. Messages are persisted to PostgreSQL and broadcast via Socket.IO.
4. Redis pub/sub propagates events to all backend instances.
5. Presence updates and typing indicators are emitted in real time.

## Scalability Considerations

- Horizontal backend scaling via stateless tokens + Redis adapter
- Message pagination and database indexes for large channels
- Redis caching on membership and channel metadata
- WebSocket room optimization to only fan out to subscribed users
