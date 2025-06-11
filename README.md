# Contest Store - Anton F

## Additional features 😎

- Swipe right from the edge to go back - similar to phone native navigation behavior
- All interactions animated, smooth layout change on search
- Additional cart info
- Badges for out of stock products and low quantity
- Splash screen
- Haptic feedbacks
- On product details page swiping main image will navigate between images, while scrolling vertically will scroll the image
- Easter egg: Not store game on the home screen 👀

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
