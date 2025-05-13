<<<<<<< HEAD
# Cargo-Tracker-Frontend
=======
# Cargo Shipment Tracker Frontend

This is the frontend web application for the Cargo Shipment Tracker, built with React, Redux Toolkit, and React Router.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository

```
git clone <repo-url>
cd cargo-shipment-tracker-frontend
```

2. Install dependencies

```
npm install
```

3. Set up environment variables

```
cp .env.example .env
```

Edit the `.env` file with your API URL (backend service URL).

4. Start the development server

```
npm start
```

The application will be available at http://localhost:3000

## Features

- Interactive dashboard with sortable/filterable shipment table
- Detailed shipment view with interactive map
- Create new shipments with multi-stop routes
- Update shipment locations in real-time
- Track ETA based on current position
- Cargo type management
- Fleet management
- Help and support system

## Build for Production

```
npm run build
```

This will create a `build` folder with optimized production assets.

## Environment Variables

The following environment variables are used:

- `REACT_APP_API_URL` - URL of the backend API service (e.g., http://localhost:5000/api)
- `REACT_APP_MAP_TILE_URL` - URL for map tiles (optional)

## Assumptions

- The API is available at the URL specified in the `.env` file
- Authentication is not implemented in this MVP
- The application will be accessed via modern browsers that support ES6+ features
- The backend server is running on port 5000
>>>>>>> ed02382 (Initial commit: Cargo Tracker Frontend)
