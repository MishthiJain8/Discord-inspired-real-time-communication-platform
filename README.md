# Discord-Inspired Real-Time Communication Platform

A production-ready, Discord-inspired real-time communication platform built with:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Cache & Pub/Sub: Redis
- Real-time: Socket.IO
- Auth: JWT with refresh token rotation
- Deployment: Docker + Docker Compose

## Features

- User registration, login, and profile updates
- JWT access tokens and refresh tokens
- Server/workspace and channel management
- Public/private channels with role-based permissions
- Real-time messaging, typing indicators, read receipts
- Presence tracking and active user counts
- Message persistence with pagination
- Redis Pub/Sub for horizontal scaling
- Clean service/repository architecture with validation and error handling

## Getting Started

1. Copy the environment example:

```bash
cp .env.example .env
```

2. Start services with Docker Compose:

```bash
docker compose up --build
```

3. Open the frontend at `http://localhost:5173` and backend at `http://localhost:4000`.

## Development Scripts

```bash
npm install
npm run dev:server
npm run dev:client
npm run test
```

## Database Schema

See `docs/database-schema.sql` for the PostgreSQL schema and indexes.

## API Documentation

See `docs/api.md` for detailed REST API routes.
# Discord-inspired-real-time-communication-platform
