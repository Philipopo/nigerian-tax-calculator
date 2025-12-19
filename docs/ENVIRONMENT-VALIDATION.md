# Environment Variable Validation System

## Overview

The Nigerian Tax Calculator uses a comprehensive runtime validation system to ensure all required environment variables are properly configured before the application starts. This prevents runtime errors and provides developers with immediate, actionable feedback.

## How It Works

### 1. Validation Module (`src/lib/env.ts`)

The core validation logic is in [src/lib/env.ts](../src/lib/env.ts). This module:

- Defines TypeScript interfaces for all environment variables
- Validates client-side variables (NEXT_PUBLIC_*)
- Validates server-side variables (secrets)
- Throws detailed errors when variables are missing or empty
- Exports a type-safe `env` object for use throughout the app

**Key Features:**
- ✅ Runtime validation on app startup
- ✅ TypeScript autocomplete for all variables
- ✅ Separate validation for client vs server variables
- ✅ Helpful error messages with fix instructions

### 2. Integration Points

#### A. App Layout (`app/layout.tsx`)

The validation is integrated at the root layout level:

```typescript
// app/layout.tsx
import '@/lib/env';  // Validates on import
import { EnvErrorBoundary } from './components/EnvErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EnvErrorBoundary>
          {/* App content */}
        </EnvErrorBoundary>
      </body>
    </html>
  );
}
```

**Why here?**
- Runs before any other app code
- Catches errors at the earliest possible moment
- Prevents partial app initialization with missing config

#### B. Error Boundary (`app/components/EnvErrorBoundary.tsx`)

React Error Boundary that catches validation errors:

```typescript
export class EnvErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Catches environment validation errors
    // Displays helpful error UI
  }
}
```

**Purpose:**
- Gracefully catches validation errors
- Prevents app crash
- Logs detailed error information to console

#### C. Error Display (`app/components/EnvErrorDisplay.tsx`)

Beautiful, developer-friendly error UI:

```typescript
export function EnvErrorDisplay({ error }: EnvErrorDisplayProps) {
  // Parses error message
  // Displays formatted, helpful error screen
}
```

**Features:**
- 🎨 Styled error display with dark theme
- 📋 Shows exactly which variables are missing/empty
- 💡 Provides step-by-step fix instructions
- 🔄 Reload button to retry after fixing

## Validation Flow

```
1. App starts
   ↓
2. app/layout.tsx loads
   ↓
3. import '@/lib/env' executes
   ↓
4. validateClientEnv() runs
   ├─ Checks all NEXT_PUBLIC_* variables
   ├─ Identifies missing variables
   └─ Identifies empty variables
   ↓
5. validateServerEnv() runs (server-side only)
   ├─ Checks all secret variables
   ├─ Identifies missing secrets
   └─ Identifies empty secrets
   ↓
6. If errors found:
   ├─ Throws detailed error
   ├─ EnvErrorBoundary catches it
   └─ EnvErrorDisplay shows helpful UI
   ↓
7. If all valid:
   └─ App continues normally
```

## Error Message Example

When variables are missing, developers see:

```
⚙️ Environment Configuration Required
   Nigerian Tax Calculator

❌ Environment Variable Validation Failed!

Required client-side environment variables are not properly configured.

Missing variables (not defined in .env.local):
  - NEXT_PUBLIC_PLASMIC_PROJECT_ID

Empty variables (defined but have no value):
  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

How to fix:
1. Copy .env.example to .env.local:
   cp .env.example .env.local

2. Fill in the missing/empty values in .env.local

3. Restart your development server

See .env.example for guidance on where to get these values.
```

## Testing the Validation

### Manual Testing

1. **Comment out a variable in .env.local:**
   ```bash
   # NEXT_PUBLIC_SUPABASE_URL=https://...
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Visit the app in browser:**
   - You should see the error display screen
   - Error will list the missing variable
   - Instructions will guide you to fix it

4. **Restore the variable and reload:**
   - Uncomment the variable
   - Click the "🔄 Retry" button
   - App should load normally

### Automated Testing

Run the validation test script:

```bash
node scripts/test-env-validation.mjs
```

This script:
- ✅ Checks which variables have values
- ⚠️ Identifies empty variables
- ❌ Identifies missing variables
- 📋 Shows example error message

## Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│ app/layout.tsx (Root Layout)                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ import '@/lib/env'                              │ │
│ │ ↓                                               │ │
│ │ Validation runs immediately                     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ EnvErrorBoundary                                │ │
│ │ ├─ Catches validation errors                    │ │
│ │ ├─ Logs to console                              │ │
│ │ └─ Renders EnvErrorDisplay                      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ App Content                                     │ │
│ │ (Only loads if validation passes)               │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
nigerian-tax-calculator/
├── src/lib/
│   ├── env.ts                      # Validation logic & types
│   ├── env-usage-examples.md       # Usage documentation
│   └── README.md                   # Quick reference
├── app/
│   ├── layout.tsx                  # Integration point
│   └── components/
│       ├── EnvErrorBoundary.tsx    # Error boundary
│       └── EnvErrorDisplay.tsx     # Error UI
├── scripts/
│   └── test-env-validation.mjs     # Test script
├── .env.local                      # Your actual env vars
└── .env.example                    # Template with docs
```

## Benefits for Development Team

### 1. **Immediate Feedback**
- Errors caught at startup, not during runtime
- No mysterious "undefined" errors in production
- Clear, actionable error messages

### 2. **Better Developer Experience**
- TypeScript autocomplete for all env vars
- Type-safe access prevents typos
- Beautiful error UI guides developers to solutions

### 3. **Team Onboarding**
- New developers immediately see what's needed
- `.env.example` provides complete documentation
- Test script helps verify setup

### 4. **Security**
- Clear separation of public vs secret variables
- Server variables never accessible in browser
- Type system prevents accidental exposure

### 5. **Maintainability**
- Centralized env var definitions
- Easy to add new required variables
- Self-documenting through TypeScript types

## Best Practices

### ✅ DO

1. **Use the validated env object:**
   ```typescript
   import { env } from '@/lib/env'
   const url = env.NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Add new variables to the type definitions:**
   ```typescript
   // In src/lib/env.ts
   interface ClientEnv {
     NEXT_PUBLIC_NEW_VAR: string  // Add here
   }
   ```

3. **Update validation arrays:**
   ```typescript
   const requiredClientVars = [
     'NEXT_PUBLIC_NEW_VAR',  // Add here
     // ... existing vars
   ]
   ```

4. **Document in .env.example:**
   ```bash
   # New Variable (description)
   # Get from: https://...
   NEXT_PUBLIC_NEW_VAR=your_value_here
   ```

### ❌ DON'T

1. **Don't use process.env directly:**
   ```typescript
   // Bad - no validation, no types
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Don't skip validation in production:**
   ```typescript
   // Bad - validation should run everywhere
   if (process.env.NODE_ENV !== 'production') {
     validateEnv()
   }
   ```

3. **Don't access server vars in client:**
   ```typescript
   'use client'
   // Bad - this will be undefined!
   const secret = env.SUPABASE_SERVICE_ROLE_KEY
   ```

## Troubleshooting

### Issue: "Module not found: @/lib/env"

**Solution:** Check your `tsconfig.json` paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Validation passes but variables are undefined in app

**Cause:** Cached build or old dev server

**Solution:**
1. Stop dev server
2. Delete `.next` folder: `rm -rf .next`
3. Restart: `npm run dev`

### Issue: Server variables showing as undefined

**Cause:** Trying to access server variables in client component

**Solution:** Use `isServer()` guard:
```typescript
import { env, isServer } from '@/lib/env'

if (isServer()) {
  const secret = env.SUPABASE_SERVICE_ROLE_KEY
}
```

### Issue: Error boundary not catching validation errors

**Cause:** Error thrown before React renders

**Solution:** This is expected - the import-time validation will crash the build/dev server. The error boundary catches errors during render, but import-time errors happen earlier.

## Extending the System

### Adding a New Required Variable

1. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_MY_NEW_VAR=my_value
   ```

2. **Add type definition in src/lib/env.ts:**
   ```typescript
   interface ClientEnv {
     NEXT_PUBLIC_MY_NEW_VAR: string
   }
   ```

3. **Add to validation array:**
   ```typescript
   const requiredClientVars = [
     'NEXT_PUBLIC_MY_NEW_VAR',
     // ...
   ]
   ```

4. **Add to .env.example:**
   ```bash
   # My New Variable
   # Description of what it does
   # Get from: https://...
   NEXT_PUBLIC_MY_NEW_VAR=your_value_here
   ```

5. **Use in code:**
   ```typescript
   import { env } from '@/lib/env'
   const myVar = env.NEXT_PUBLIC_MY_NEW_VAR  // TypeScript autocomplete!
   ```

### Making Variables Optional

If you want to make some variables optional (not required):

```typescript
interface ClientEnv {
  NEXT_PUBLIC_OPTIONAL_VAR?: string  // Note the ?
}

// Don't add to requiredClientVars array
// Validation will skip optional variables
```

## Summary

The environment validation system provides:
- ✅ **Immediate error detection** at startup
- ✅ **Type-safe access** to all environment variables
- ✅ **Beautiful error UI** for developers
- ✅ **Clear documentation** through types and comments
- ✅ **Security** through proper variable separation
- ✅ **Better DX** with autocomplete and validation

Integration points:
1. [app/layout.tsx:10-12](../app/layout.tsx#L10-L12) - Import trigger
2. [app/layout.tsx:34-38](../app/layout.tsx#L34-L38) - Error boundary wrapper
3. [src/lib/env.ts](../src/lib/env.ts) - Validation logic

All developers get instant feedback about missing configuration, preventing runtime issues and improving team productivity.
