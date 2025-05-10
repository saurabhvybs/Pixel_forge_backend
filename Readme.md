# Pixel Forge Tech - Backend

## Overview
This is the backend service for Pixel Forge Tech, built with Node.js, Express, and TypeScript. It uses PostgreSQL (Neon DB) as the database.

## Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL (Neon DB account)
- Docker and Docker Compose (for containerized development)

## Project Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── tests/              # Test files
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore file
├── Dockerfile         # Docker configuration
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:19000

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Installation

### Local Development
1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
```

### Docker Development
1. Build and start the containers
```bash
docker-compose up --build
```

2. To stop the containers
```bash
docker-compose down
```

## Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm run test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code with Prettier

## API Documentation
The API documentation is available at `/api-docs` when running the server.

## Common Issues and Solutions

### Database Connection Issues
- Ensure your Neon DB connection string is correct
- Check if your IP is whitelisted in Neon DB
- Verify database credentials

### Authentication Issues
- Ensure JWT secrets are properly set
- Check token expiration times
- Verify CORS settings if accessing from frontend

### Docker Issues
- If containers fail to start, check port conflicts
- Ensure all environment variables are properly set
- Check Docker logs for detailed error messages

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License
[Your License Here]
