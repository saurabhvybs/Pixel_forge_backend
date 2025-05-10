#!/bin/bash

# Install necessary type declarations
npm install --save-dev @types/express @types/cors @types/node @types/bcryptjs @types/jsonwebtoken

# Generate Prisma client
npx prisma generate

# Run TypeScript compilation
npx tsc

# Success message
echo "Build completed successfully!"