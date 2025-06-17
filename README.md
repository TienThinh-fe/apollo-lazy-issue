# Apollo Client Lazy Query Cache Issue Reproduction (Global State)

This project demonstrates a cache issue with Apollo Client's `useLazyQuery` when making requests with different variables before the first request completes. The demo now uses React Context for global state management and async/await patterns similar to production applications.

## Issue Description

When using `useLazyQuery` with different variables:

1. If you trigger a query with variable A
2. Then immediately trigger the same query with variable B (before query A completes)
3. Only the result for variable B will be cached
4. Query A's result is lost and requires another request

This affects both Apollo Client cache and application global state.

## Project Structure

- `backend/` - Simple GraphQL server with artificial delay
- `frontend/` - React app with Apollo Client demonstrating the issue
  - Uses React Context for global state management
  - Implements async/await pattern with loading states
  - Similar to real-world filter components

## Setup & Running

### Backend (GraphQL Server)

```bash
cd backend
npm install
npm start
```

The server will start on http://localhost:4000

### Frontend (React App)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## How to Reproduce the Issue

1. Start both backend and frontend servers
2. Open the frontend in your browser
3. Open browser console to see request logs
4. Follow these steps quickly:
   - Click "Load Tags" button and observe loading state
   - **Immediately** click "Load Persons" button (before Tags loads)
   - Notice only Persons data appears in the UI
   - Click "Load Tags" again - it makes another request instead of using cache
   - Use "Clear All Data" to reset global state

## Expected vs Actual Behavior

**Expected:** Both queries should complete and cache their results independently.

**Actual:** Only the last query's result is cached, previous query results are lost from both Apollo cache and global application state.

## Technical Details

- Backend simulates network delay (1-2 seconds) to make the race condition easier to reproduce
- Frontend uses async/await pattern with loading states (similar to production filter components)
- Global state management via React Context demonstrates real-world impact
- Console logs show when requests are sent and completed
- The issue occurs because Apollo Client overwrites the cache entry for queries that complete later

## Code References

- Backend GraphQL resolver: `backend/index.js`
- Frontend component with lazy query: `frontend/src/FilterComponent.jsx`
- Global state context: `frontend/src/context/FilterContext.jsx`
- Apollo Client setup: `frontend/src/main.jsx`
