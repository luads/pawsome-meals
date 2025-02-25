# Pawsome Meals

A web application for managing personalized dog food subscriptions.

Disclaimer: This is a test project developed entirely by Cursor's Composer feature.

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js 18.19.0 (installed via nvm)
- npm (included with Node.js)

## Project Structure

```
.
├── backend/         # NestJS backend
├── frontend/        # Next.js frontend
```

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:luads/pawsome-meals.git
cd pawsome-meals
```

2. Set up Node.js:
```bash
# Backend setup
cd backend
nvm install    # Installs Node version from .nvmrc
nvm use        # Uses the correct Node version
npm install    # Installs dependencies

# Frontend setup
cd ../frontend
nvm install    # Installs Node version from .nvmrc
nvm use        # Uses the correct Node version
npm install    # Installs dependencies
```

3. Set up environment variables:

Create `.env` files in both frontend and backend directories:

```bash
# backend/.env
PORT=3001

# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

1. Start the backend:
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:3001`

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```
The web app will be available at `http://localhost:3000`


## Available Scripts

Backend:
- `npm run dev` - Start development server
- `npm run payment:process` - Process subscription payments
- `npm run clear-db` - Clear the database
- `npm run format` - Format the code

Frontend:
- `npm run dev` - Start development server
- `npm run format` - Format the code

## License

[MIT](LICENSE)
