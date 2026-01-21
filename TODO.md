# Migration Todo List: Convert App to React Router v7 Template

## Overview

Convert the entire React signup/verification boilerplate app to use the React Router v7 template structure while preserving all existing functionalities and designs.

---

## Phase 1: Project Setup & Configuration

### 1.1 Update Build System

- [ ] Replace Vite config with React Router build system
- [ ] Update `package.json` scripts to use React Router CLI (`react-router dev`, `react-router build`)
- [ ] Copy and adapt `react-router.config.ts` from template (keep SSR: false for SPA mode)
- [ ] Update dependencies in package.json:
  - [ ] Replace `react-router-dom@5` with `react-router@7`
  - [ ] Add `@react-router/dev@7`
  - [x] Remove ALL legacy form/validation dependencies (cleaner, zero-dependency approach):
    - [x] **Remove `formik`** - Use native React controlled components (useState + onChange) ✅ COMPLETED
    - [x] **Remove `yup`** - Use plain JavaScript validation functions ✅ COMPLETED
    - [x] **Remove `rxjs`** - Already using React Context for alerts (no library needed) ✅ COMPLETED
    - [ ] **Remove `query-string`** - Use React Router v7's `useSearchParams()` or native `URLSearchParams`
  - [x] **Email Verification Removed** - Users can now login immediately after registration ✅ COMPLETED
    - See: `CHANGELOG-EMAIL-VERIFICATION-REMOVAL.md` for details
  - [ ] Decide on styling approach (keep LESS or migrate to TailwindCSS)

### 1.2 Project Structure Migration

- [ ] Create `app/` directory (React Router v7 convention)
- [ ] Move `src/` contents to `app/` with appropriate reorganization
- [ ] Update all import paths from `src/` to `app/`

---

## Phase 2: Core Infrastructure

### 2.1 Root Layout & App Shell

- [ ] Create `app/root.jsx` based on template
- [ ] Integrate existing `<Nav />` component into root layout
- [ ] Integrate existing `<Alert />` component into root layout
- [ ] Add existing `styles.less` or convert to CSS/TailwindCSS
- [ ] Set up fake backend initialization in root

### 2.2 Context Providers Migration

- [ ] Move `src/contexts/AuthContext.jsx` to `app/contexts/AuthContext.jsx`
  - [ ] Ensure compatibility with React Router v7
  - [ ] Update to use React Router v7's navigation APIs (useNavigate)
- [ ] Move `src/contexts/AlertContext.jsx` to `app/contexts/AlertContext.jsx`
  - [ ] Keep alert functionality working
- [ ] Integrate contexts into `app/root.jsx` Layout component

### 2.3 Hooks Migration

- [ ] Move `src/hooks/useUsers.js` to `app/hooks/useUsers.js`
  - [ ] Update to use new React Router APIs if needed

### 2.4 Fake Backend Setup

- [ ] Move `src/_helpers/fake-backend.js` to `app/utils/fake-backend.js`
- [ ] **DO NOT modify fake-backend functionality**
- [ ] Ensure fake backend is configured and initialized in `app/root.jsx`

---

## Phase 3: Routing System Migration

### 3.1 Setup Route Configuration

- [ ] Create `app/routes.ts` (file-based routing config)
- [ ] Define all routes matching current app structure:
  - [ ] Home route (/)
  - [ ] Profile routes (/profile/\*)
  - [ ] Admin routes (/admin/\*)
  - [ ] Account routes (/account/\*)

### 3.2 Private Route Implementation

- [ ] Migrate `src/_components/PrivateRoute.jsx` to React Router v7 pattern
  - [ ] Use route loaders for authentication checks
  - [ ] Implement role-based access control
  - [ ] Handle redirects for unauthorized access

### 3.3 Convert Route Components to React Router v7 Format

- [x] Update all route components to use new React Router v7 APIs:
  - [x] Replace `useHistory` with `useNavigate` (already done for v5 compatibility)
  - [ ] Verify `useLocation` works with React Router v7
  - [ ] Verify `useParams` works with React Router v7
  - [ ] Use `loader` functions for data fetching where appropriate

---

## Phase 4: Component Migration

### 4.1 Shared Components

- [ ] Move `src/_components/Nav.jsx` to `app/components/Nav.jsx`
  - [ ] Keep all existing navigation logic and styling
  - [ ] Update router imports and navigation methods
- [ ] Move `src/_components/Alert.jsx` to `app/components/Alert.jsx`
  - [ ] Keep existing alert display logic
- [ ] Convert `src/_components/PrivateRoute.jsx` to new routing pattern
- [ ] Move `src/_components/index.js` to `app/components/index.js`

### 4.2 Account Section

- [ ] Move `src/account/Index.jsx` to `app/routes/account.jsx` (layout route)
- [ ] Move `src/account/Login.jsx` to `app/routes/account.login.jsx`
  - [x] Already using native React controlled components (useState)
  - [x] Already using plain JavaScript validation
  - [ ] Update navigation after successful login (verify works with v7)
  - [ ] Preserve all existing styles
- [ ] Move `src/account/Register.jsx` to `app/routes/account.register.jsx`
  - [x] Already using native React controlled components
  - [x] Already using plain JavaScript validation
  - [ ] Preserve registration flow
  - [ ] Keep all styling
- [ ] Move `src/account/VerifyEmail.jsx` to `app/routes/account.verify-email.jsx`
  - [ ] Keep email verification logic
  - [ ] Replace query-string with `useSearchParams()` hook
- [ ] Move `src/account/ForgotPassword.jsx` to `app/routes/account.forgot-password.jsx`
  - [x] Already using native React controlled components
  - [x] Already using plain JavaScript validation
  - [ ] Preserve functionality
- [ ] Move `src/account/ResetPassword.jsx` to `app/routes/account.reset-password.jsx`
  - [x] Already using native React controlled components
  - [x] Already using plain JavaScript validation
  - [ ] Replace query-string with `useSearchParams()` for token handling

### 4.3 Home Section

- [ ] Move `src/home/Index.jsx` to `app/routes/_index.jsx` or `app/routes/home.jsx`
  - [ ] Keep existing home page design and functionality
  - [ ] Ensure it's protected by authentication
  - [ ] Preserve any data fetching logic

### 4.4 Profile Section

- [ ] Move `src/profile/Index.jsx` to `app/routes/profile.jsx` (layout route)
- [ ] Move `src/profile/Details.jsx` to `app/routes/profile._index.jsx`
  - [ ] Keep profile display logic
  - [ ] Keep all styling
- [ ] Move `src/profile/Update.jsx` to `app/routes/profile.update.jsx`
  - [x] Already using native React controlled components
  - [x] Already using plain JavaScript validation
  - [ ] Preserve update functionality

### 4.5 Admin Section

- [ ] Move `src/admin/Index.jsx` to `app/routes/admin.jsx` (layout route)
- [ ] Move `src/admin/Overview.jsx` to `app/routes/admin._index.jsx`
  - [ ] Keep admin dashboard design
  - [ ] Ensure role-based access (Admin only)
- [ ] Move `src/admin/users/Index.jsx` to `app/routes/admin.users.jsx` (layout)
- [ ] Move `src/admin/users/List.jsx` to `app/routes/admin.users._index.jsx`
  - [ ] Keep user list display and functionality
  - [ ] Keep delete functionality
  - [ ] Preserve styling
- [ ] Move `src/admin/users/AddEdit.jsx` to `app/routes/admin.users.$id.jsx`
  - [ ] Handle both add (new) and edit modes
  - [x] Already using native React controlled components
  - [x] Already using plain JavaScript validation
  - [ ] Preserve save/update functionality

---

## Phase 5: Utilities & Constants

### 5.1 Constants Migration

- [ ] Move `src/constants/roles.js` to `app/constants/roles.js`
  - [ ] Update all imports
- [ ] Move `src/constants/alertTypes.js` to `app/constants/alertTypes.js`
  - [ ] Update all imports

### 5.2 Config Migration

- [ ] Move `src/config.js` to `app/config.js`
  - [ ] Ensure API URL configuration works

### 5.3 Helpers (if any remain)

- [ ] Review `src/_helpers/index.js` for any remaining utilities
- [ ] Migrate needed helpers to `app/utils/` as JavaScript
- [ ] Remove or convert legacy helpers

---

## Phase 6: Styling

### 6.1 Style System Decision

- [ ] **Option A**: Keep existing LESS styles
  - [ ] Set up LESS compilation in React Router build
  - [ ] Move `src/styles.less` to `app/styles.less`
  - [ ] Import in root layout
- [ ] **Option B**: Convert to CSS
  - [ ] Convert `styles.less` to plain CSS
  - [ ] Update all class names if needed
- [ ] **Option C**: Migrate to TailwindCSS (like template)
  - [ ] Install TailwindCSS dependencies (already in template)
  - [ ] Convert all LESS/CSS classes to Tailwind utilities
  - [ ] Keep visual design identical

### 6.2 Component Styling

- [ ] Ensure all components maintain their original appearance
- [ ] Test responsive design
- [ ] Verify all CSS classes are working

---

## Phase 7: Testing & Validation

### 7.1 Functionality Testing

- [ ] Test user registration flow
  - [ ] Registration form submission
  - [ ] Email verification
  - [ ] Success/error alerts
- [ ] Test login flow
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials
  - [ ] Session persistence
  - [ ] Auto-redirect after login
- [ ] Test forgot/reset password flow
  - [ ] Request reset email
  - [ ] Reset password with token
  - [ ] Invalid token handling
- [ ] Test profile management
  - [ ] View profile details
  - [ ] Update profile
  - [ ] Validation errors
- [ ] Test admin functionality
  - [ ] Admin dashboard access (Admin role only)
  - [ ] User list display
  - [ ] Add new user
  - [ ] Edit existing user
  - [ ] Delete user
  - [ ] Non-admin access prevention

### 7.2 Authentication & Authorization

- [ ] Test PrivateRoute protection
- [ ] Test role-based access (Admin routes)
- [ ] Test redirect to login when not authenticated
- [ ] Test navigation after login
- [ ] Test logout functionality

### 7.3 Fake Backend

- [ ] Verify fake backend intercepts all API calls
- [ ] Test all API endpoints:
  - [ ] POST /accounts/authenticate
  - [ ] POST /accounts/register
  - [ ] POST /accounts/verify-email
  - [ ] POST /accounts/forgot-password
  - [ ] POST /accounts/reset-password
  - [ ] GET /accounts (admin)
  - [ ] GET /accounts/:id
  - [ ] PUT /accounts/:id
  - [ ] DELETE /accounts/:id

### 7.4 Navigation & Routing

- [ ] Test all route navigation
- [ ] Test browser back/forward buttons
- [ ] Test direct URL access
- [ ] Test 404 handling
- [ ] Test trailing slash redirects

### 7.5 Error Handling

- [ ] Test form validation errors
- [ ] Test API error responses
- [ ] Test network errors (if applicable with fake backend)
- [ ] Test alert display for all error types

---

## Phase 8: Cleanup

### 8.1 Remove Old Files

- [ ] Remove `src/` directory after migration is complete
- [ ] Remove old Vite config files if no longer needed
- [ ] Update ESLint config if needed for React Router v7
- [ ] Remove `index.html` from root if React Router generates it

### 8.2 Update Documentation

- [ ] Update README.md with new build commands
- [ ] Document new project structure
- [ ] Update any setup instructions
- [ ] Document migration decisions (LESS vs Tailwind, etc.)

### 8.3 Dependency Cleanup

- [ ] Remove unused dependencies from package.json
- [ ] Run `npm install` to update lock file
- [ ] Check for dependency conflicts
- [ ] Run security audit

---

## Phase 9: Build & Deploy Verification

### 9.1 Development Build

- [ ] Run `npm run dev`
- [ ] Test all functionality in dev mode
- [ ] Verify HMR (Hot Module Replacement) works
- [ ] Check for console errors

### 9.2 Production Build

- [ ] Run `npm run build`
- [ ] Verify build completes without errors
- [ ] Check build output size
- [ ] Test production build locally
- [ ] Verify all routes work in production mode

### 9.3 Final Validation

- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Performance check
- [ ] Accessibility check (if applicable)

---

## Notes & Decisions

### Key Migration Decisions to Make:

1. **Styling**: Keep LESS, convert to CSS, or migrate to TailwindCSS?
2. **Language**: Keep as JavaScript (no TypeScript migration)
3. **Route structure**: Exact match to current URLs or can paths change?
4. **SSR**: Keep as SPA (ssr: false) or enable SSR?

### Important Constraints:

- ✅ **DO NOT** modify fake backend functionality
- ✅ **PRESERVE** all existing features and user flows
- ✅ **MAINTAIN** visual design and styling
- ✅ **REMOVE** Formik/Yup/rxjs/query-string - use native React and browser APIs
- ✅ **ENSURE** role-based access control works identically

### React Router v7 Key Changes:

- Uses file-based routing (similar to Remix)
- New `loader` and `action` APIs for data fetching
- Updated navigation hooks (`useNavigate` instead of `useHistory`)
- Outlets instead of component props in routes
- Layout routes for nested routing

### Native Form Implementation Guide:

**Replacing Formik (ALREADY DONE):**

```jsx
// Instead of Formik - now using native React
const [formData, setFormData] = useState({ email: "", password: "" });
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate and submit
};
```

**Replacing Yup (ALREADY DONE):**

```jsx
// Simple validation functions - already implemented
const validate = (values) => {
  const errors = {};
  if (!values.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";
  if (!values.password) errors.password = "Password is required";
  return errors;
};
```

**Replacing query-string:**

```jsx
// React Router v7 provides useSearchParams
const [searchParams] = useSearchParams();
const token = searchParams.get("token");

// Or use native URLSearchParams
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
```

**Replacing rxjs for alerts (ALREADY DONE):**

```jsx
// Already handled by React Context - no library needed
const { error: showError } = useAlert();
showError("Error message");
```

---

## Success Criteria

✅ All user-facing functionality works identically to original app
✅ All routes are accessible and working
✅ Authentication and authorization work correctly
✅ Forms validate and submit properly (using native React - no Formik/Yup)
✅ Alerts display correctly
✅ Visual design matches original
✅ Fake backend intercepts all API calls
✅ Production build succeeds
✅ No console errors
✅ All code remains in JavaScript (no TypeScript)

---

**Total Tasks**: ~100+ individual tasks organized into 9 phases

**Estimated Complexity**: High - Major framework migration with routing system overhaul
