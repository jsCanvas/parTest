# Kanban Board Project

This is a full-stack Kanban board application built with:
- **Frontend**: React, Ant Design, @hello-pangea/dnd (Vite)
- **Backend**: Python FastAPI, SQLAlchemy
- **Database**: MySQL 8.0

## Prerequisites
- Docker & Docker Compose

## Quick Start

1. Run the application:
   ```bash
   docker compose up --build
   ```

2. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Features
- Create tasks
- Delete tasks
- Drag and drop tasks between "To Do", "In Progress", and "Done" columns.
- Data persists in MySQL database.

## Development
The `docker-compose.yml` mounts local directories into containers, so changes to `frontend/src` or `backend/app` will hot-reload.
