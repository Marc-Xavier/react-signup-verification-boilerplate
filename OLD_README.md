# Frontend Architecture Refactoring Task

## Objective

Refactor the entire frontend to eliminate overly-separated architecture that makes code hard to trace for new developers:

- **Remove Service layer** (_services/)
- **Remove Helpers** (_helpers/)
- **Remove Fetch wrappers**

Replace with a simpler, more traceable architecture that keeps related logic closer to where it's used.

## Critical Constraints

**DO NOT TOUCH:**
- fake-backend functionality
- Any backend simulation code
- Server-side logic

**MUST USE:**
- **Native JavaScript `fetch()` function ONLY** for all API calls to the fake backend
- No fetch wrappers, no axios, no other HTTP libraries
- Plain, vanilla fetch API

## Current Architecture Problems

The current codebase has unnecessary abstraction layers:

1. **Services Layer** (src/_services/)
   - account.service.js - Authentication and account management
   - alert.service.js - Alert notifications with RxJS observables
   - user.service.js - User CRUD operations
   - Abstracts API calls too far from components

2. **Helpers** (src/_helpers/)
   - fetch-wrapper.js - HTTP request wrapper
   - history.js - Browser history abstraction
   - role.js - Role enumeration
   - auth-header.js - Authorization header builder
   - Creates unnecessary indirection

3. **Fetch Wrappers**
   - Custom fetch abstraction with get/post/put/delete methods
   - Automatic auth header injection
   - Error handling that's hidden from components

## Problems with Current Architecture

- **Hard to trace**: Following a login flow requires jumping through 4+ files
- **Over-abstraction**: Simple API calls buried in service classes
- **Difficult onboarding**: New developers can't easily understand data flow
- **Tight coupling**: Components depend on global services and observables
- **Hidden state**: RxJS observables make state changes non-obvious

## New Architecture Goals

1. **Colocation**: Keep API logic close to components that use it
2. **Explicit data flow**: Make it obvious where data comes from
3. **Modern patterns**: Use React hooks, Context API, and **native fetch**
4. **Easy to trace**: Follow code flow without jumping between files
5. **Beginner friendly**: New developers can understand the code quickly
6. **Native fetch only**: Use plain JavaScript fetch() - no wrappers or libraries

## Proposed Approach

### Replace Services with:
- **Custom React hooks** for data fetching (useAuth, useUsers, etc.)
- **Context API** for global state (auth state, alerts)
- **Native fetch() calls** in hooks instead of service layer

### Replace Helpers with:
- **Inline utilities** where needed
- **Constants files** for enums (roles)
- **React Router's useNavigate** instead of history helper

### Replace Fetch Wrapper with:
- **Native JavaScript fetch() API** - no wrappers whatsoever
- **Centralized error handling** via interceptor pattern or utility functions
- **Token management** in auth context
- **Manual header construction** using plain objects

## Expected Benefits

- ✅ Easier to understand for new developers
- ✅ Better code locality - related logic stays together
- ✅ Simpler debugging - fewer layers to trace through
- ✅ Modern React patterns (hooks + context)
- ✅ Less "magic" - more explicit code flow
- ✅ Easier to modify - change API call right where it's used
- ✅ Standard web API - no custom abstractions to learn

## Files to Refactor

### Components to Update:
- src/account/* (Login, Register, VerifyEmail, etc.)
- src/admin/* (User management)
- src/profile/* (Profile management)
- src/app/Index.jsx (Main app routing)
- src/_components/* (Alert, Nav, PrivateRoute)

### Files to Remove:
- src/_services/account.service.js
- src/_services/alert.service.js
- src/_services/user.service.js
- src/_helpers/fetch-wrapper.js
- src/_helpers/history.js
- src/_helpers/auth-header.js

### Files to Keep:
- src/_helpers/role.js (convert to constants)
- src/_helpers/fake-backend.js (DO NOT MODIFY)

## Implementation Strategy

1. Create new architecture:
   - src/contexts/AuthContext.jsx
   - src/contexts/AlertContext.jsx
   - src/hooks/useAuth.js
   - src/hooks/useUsers.js
   - src/utils/fetchHelpers.js (minimal utilities for native fetch, if needed)
   - src/constants/roles.js

2. Migrate components one section at a time:
   - Account section (login, register, etc.)
   - Profile section
   - Admin section
   - Global components (Nav, Alert)

3. Remove old architecture files
4. Test all functionality

## Technical Requirements

### API Calls Must Use Native Fetch:

```javascript
// Example: Login
const response = await fetch(`${apiUrl}/accounts/authenticate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(error);
}

const user = await response.json();
```

### No Wrappers Allowed:
- ❌ Custom fetch wrappers
- ❌ Axios or other HTTP libraries
- ❌ Service layer abstractions
- ✅ Only native `fetch()` API

## Success Criteria

- ✅ All functionality works exactly as before
- ✅ No service layer dependencies
- ✅ No helper dependencies (except fake-backend)
- ✅ All API calls use **native fetch() only**
- ✅ Code is easier to trace and understand
- ✅ New developers can follow the flow easily
- ✅ Fake backend continues to work unchanged
