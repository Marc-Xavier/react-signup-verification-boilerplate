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
  - [ ] Remove ALL legacy form/validation dependencies (cleaner, zero-dependency approach):
    - [ ] **Remove `formik`** - Use native React controlled components (useState + onChange)
    - [ ] **Remove `yup`** - Use plain JavaScript validation functions
    - [ ] **Remove `rxjs`** - Already using React Context for alerts (no library needed)
    - [ ] **Remove `query-string`** - Use React Router v7's `useSearchParams()` or native `URLSearchParams`
    - [ ] Optional: Add `react-hook-form` + `zod` only if you prefer (but not required)
  - [ ] Decide on styling approach (keep LESS or migrate to TailwindCSS)

### 1.2 TypeScript Configuration
- [ ] Copy `tsconfig.json` from template
- [ ] Configure TypeScript to work with existing code
- [ ] Add type definitions for legacy dependencies (`@types/react-router-dom` if needed)

### 1.3 Project Structure Migration
- [ ] Create `app/` directory (React Router v7 convention)
- [ ] Move `src/` contents to `app/` with appropriate reorganization
- [ ] Update all import paths from `src/` to `app/`

---

## Phase 2: Core Infrastructure

### 2.1 Root Layout & App Shell
- [ ] Create `app/root.tsx` based on template
- [ ] Integrate existing `<Nav />` component into root layout
- [ ] Integrate existing `<Alert />` component into root layout
- [ ] Add existing `styles.less` or convert to CSS/TailwindCSS
- [ ] Set up fake backend initialization in root

### 2.2 Context Providers Migration
- [ ] Convert `src/contexts/AuthContext.jsx` to `app/contexts/AuthContext.tsx`
  - [ ] Add TypeScript types for user, auth state
  - [ ] Ensure compatibility with React Router v7
  - [ ] Update to use React Router v7's navigation APIs
- [ ] Convert `src/contexts/AlertContext.jsx` to `app/contexts/AlertContext.tsx`
  - [ ] Add TypeScript types
  - [ ] Keep alert functionality working
- [ ] Integrate contexts into `app/root.tsx` Layout component

### 2.3 Hooks Migration
- [ ] Convert `src/hooks/useUsers.js` to `app/hooks/useUsers.ts`
  - [ ] Add TypeScript types
  - [ ] Update to use new React Router APIs if needed

### 2.4 Fake Backend Setup
- [ ] Move `src/_helpers/fake-backend.js` to `app/utils/fake-backend.ts` (or keep as .js)
- [ ] **DO NOT modify fake-backend functionality**
- [ ] Ensure fake backend is configured and initialized in `app/root.tsx`

---

## Phase 3: Routing System Migration

### 3.1 Setup Route Configuration
- [ ] Create `app/routes.ts` (file-based routing config)
- [ ] Define all routes matching current app structure:
  - [ ] Home route (/)
  - [ ] Profile routes (/profile/*)
  - [ ] Admin routes (/admin/*)
  - [ ] Account routes (/account/*)

### 3.2 Private Route Implementation
- [ ] Migrate `src/_components/PrivateRoute.jsx` to React Router v7 pattern
  - [ ] Use route loaders for authentication checks
  - [ ] Implement role-based access control
  - [ ] Handle redirects for unauthorized access

### 3.3 Convert Route Components to React Router v7 Format
- [ ] Update all route components to use new React Router v7 APIs:
  - [ ] Replace `useHistory` with `useNavigate`
  - [ ] Replace `useLocation` with React Router v7 equivalent
  - [ ] Replace `useParams` if needed
  - [ ] Use `loader` functions for data fetching where appropriate

---

## Phase 4: Component Migration

### 4.1 Shared Components
- [ ] Convert `src/_components/Nav.jsx` to `app/components/Nav.tsx`
  - [ ] Keep all existing navigation logic and styling
  - [ ] Update router imports and navigation methods
  - [ ] Add TypeScript types
- [ ] Convert `src/_components/Alert.jsx` to `app/components/Alert.tsx`
  - [ ] Keep existing alert display logic
  - [ ] Add TypeScript types
- [ ] Convert `src/_components/PrivateRoute.jsx` to new routing pattern
- [ ] Update `src/_components/index.js` to TypeScript barrel export

### 4.2 Account Section
- [ ] Convert `src/account/Index.jsx` to `app/routes/account.tsx` (layout route)
- [ ] Convert `src/account/Login.jsx` to `app/routes/account.login.tsx`
  - [ ] Replace Formik with native React controlled components (useState)
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Update navigation after successful login
  - [ ] Preserve all existing styles
- [ ] Convert `src/account/Register.jsx` to `app/routes/account.register.tsx`
  - [ ] Replace Formik with native React controlled components
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Preserve registration flow
  - [ ] Keep all styling
- [ ] Convert `src/account/VerifyEmail.jsx` to `app/routes/account.verify-email.tsx`
  - [ ] Keep email verification logic
  - [ ] Replace query-string with `useSearchParams()` hook
- [ ] Convert `src/account/ForgotPassword.jsx` to `app/routes/account.forgot-password.tsx`
  - [ ] Replace Formik with native React controlled components
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Preserve functionality
- [ ] Convert `src/account/ResetPassword.jsx` to `app/routes/account.reset-password.tsx`
  - [ ] Replace Formik with native React controlled components
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Replace query-string with `useSearchParams()` for token handling

### 4.3 Home Section
- [ ] Convert `src/home/Index.jsx` to `app/routes/_index.tsx` or `app/routes/home.tsx`
  - [ ] Keep existing home page design and functionality
  - [ ] Ensure it's protected by authentication
  - [ ] Preserve any data fetching logic

### 4.4 Profile Section
- [ ] Convert `src/profile/Index.jsx` to `app/routes/profile.tsx` (layout route)
- [ ] Convert `src/profile/Details.jsx` to `app/routes/profile._index.tsx`
  - [ ] Keep profile display logic
  - [ ] Keep all styling
- [ ] Convert `src/profile/Update.jsx` to `app/routes/profile.update.tsx`
  - [ ] Replace Formik with native React controlled components
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Preserve update functionality

### 4.5 Admin Section
- [ ] Convert `src/admin/Index.jsx` to `app/routes/admin.tsx` (layout route)
- [ ] Convert `src/admin/Overview.jsx` to `app/routes/admin._index.tsx`
  - [ ] Keep admin dashboard design
  - [ ] Ensure role-based access (Admin only)
- [ ] Convert `src/admin/users/Index.jsx` to `app/routes/admin.users.tsx` (layout)
- [ ] Convert `src/admin/users/List.jsx` to `app/routes/admin.users._index.tsx`
  - [ ] Keep user list display and functionality
  - [ ] Keep delete functionality
  - [ ] Preserve styling
- [ ] Convert `src/admin/users/AddEdit.jsx` to `app/routes/admin.users.$id.tsx`
  - [ ] Handle both add (new) and edit modes
  - [ ] Replace Formik with native React controlled components
  - [ ] Replace Yup with plain JavaScript validation
  - [ ] Preserve save/update functionality

---

## Phase 5: Utilities & Constants

### 5.1 Constants Migration
- [ ] Convert `src/constants/roles.js` to `app/constants/roles.ts`
  - [ ] Add TypeScript enum or const object
  - [ ] Update all imports
- [ ] Convert `src/constants/alertTypes.js` to `app/constants/alertTypes.ts`
  - [ ] Add TypeScript types
  - [ ] Update all imports

### 5.2 Config Migration
- [ ] Move `src/config.js` to `app/config.ts`
  - [ ] Add TypeScript types for config
  - [ ] Ensure API URL configuration works

### 5.3 Helpers (if any remain)
- [ ] Review `src/_helpers/index.js` for any remaining utilities
- [ ] Migrate needed helpers to `app/utils/` as TypeScript
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
- [ ] Remove old ESLint config (or update for TypeScript)
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
2. **TypeScript strictness**: Strict mode or gradual typing?
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

**Replacing Formik:**
```tsx
// Instead of Formik
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validate and submit
};
```

**Replacing Yup:**
```tsx
// Simple validation functions
const validate = (values) => {
  const errors = {};
  if (!values.email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email';
  if (!values.password) errors.password = 'Password is required';
  return errors;
};
```

**Replacing query-string:**
```tsx
// React Router v7 provides useSearchParams
const [searchParams] = useSearchParams();
const token = searchParams.get('token');

// Or use native URLSearchParams
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
```

**Replacing rxjs for alerts:**
```tsx
// Already handled by React Context - no library needed
const { showAlert } = useAlert();
showAlert({ message: 'Success!', type: 'success' });
```

---

## Success Criteria

✅ All user-facing functionality works identically to original app
✅ All routes are accessible and working
✅ Authentication and authorization work correctly
✅ Forms validate and submit properly
✅ Alerts display correctly
✅ Visual design matches original
✅ Fake backend intercepts all API calls
✅ Production build succeeds
✅ No console errors
✅ TypeScript compilation succeeds

---

**Total Tasks**: ~100+ individual tasks organized into 9 phases

**Estimated Complexity**: High - Major framework migration with routing system overhaul
