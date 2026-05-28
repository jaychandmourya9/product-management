# Product Management App

A React + Vite application for product inventory management with authentication, Redux product CRUD, pagination, modal confirmation, and toast notifications.

## Project overview

This project includes:

- React 19 + Vite frontend
- `react-router-dom` v7 route protection
- Redux Toolkit store for product CRUD operations
- `react-hook-form` for form handling and validation
- Axios-based service layer for DummyJSON API integration
- Tailwind CSS styling with responsive layout
- Authentication persistence via localStorage
- Confirmation modal and toast feedback on product actions

## Recommended environment

- Node.js: `>=18.0.0`
- Recommended: `20.x` for best compatibility with Vite and current dependencies
- Package manager: `npm` (or `pnpm` / `yarn` if preferred)

### Use `nvm` (optional)

```bash
# Install and use Node 20 if you have nvm installed
nvm install 20
nvm use 20
```

## Getting started

### Clone the repository

```bash
git clone <repository-url> "product-management"
cd "product-management"
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open the app in your browser at the local URL shown in the terminal, usually `http://localhost:5173`.

## Available npm scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production bundle
- `npm run lint` — Run ESLint against the source files
- `npm run preview` — Preview the production build locally

## Project structure

- `src/main.jsx` — App entry point and React render setup
- `src/App.jsx` — Client routes and protected route wrapper
- `src/pages` — UI pages for login, register, dashboard, and products
- `src/store` — Redux Toolkit store and product slice
- `src/services` — API helpers for auth and product CRUD
- `src/components` — Reusable UI components such as `ConfirmDialog`

## Authentication

The app stores JWT and user details in `localStorage` under:

- `pm_auth_token`
- `pm_user`

Use the login and registration pages to authenticate and access protected routes.

## Notes

- The app uses DummyJSON API endpoints for product and auth operations.
- Product creation, update, and delete functionality is handled through the Redux store.
- UI feedback is delivered via modal confirmations and toast messages.

## Troubleshooting

If the app does not start or you see dependency errors:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

If you need a specific Node version, use `nvm` or `nvm-windows`.
