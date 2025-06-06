# Contest Store - Anton F

## Main Dependecies

- React
- Vite
- Typescript
- Tailwindcss
- Zustand
- Tanstack React Query
- React Router
- @telegram-apps/sdk-react

## Data Fetching

- Data fetching is implemented using combination of Tanstack React Query and Axios
- Tanstack React Query provides an efficient way tocache data and avoid redundant requests when accessing the same data from multiple components

## State Management

Zustand is selected as state management solution.

- Cart store - keeps the cart items, tracks quantity and total price
- App store - keeps the payment status and hasCompletedPayments flag for the success overlay

## Theme

- App supports dark and light themes
- Theme switch is implemented using @telegram-apps/sdk-react, it determines the current theme based on client's system settings

## Demonstration notes

- This is a demo app, it has no real functionality
- Payment process is simulated for demo purposes
- Dynamic data is fetched from a remote API
- History is shown on profile page after completion of at least one purchase
