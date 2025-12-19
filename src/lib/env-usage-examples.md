# Environment Variables Usage Guide

This guide shows how to use the type-safe environment variable system in the Nigerian Tax Calculator project.

## Quick Start

Instead of using `process.env` directly, import the validated `env` object:

```typescript
import { env } from '@/lib/env'

// Now you get TypeScript autocomplete and validation!
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
```

## Benefits

✅ **TypeScript Autocomplete** - Your IDE will suggest available environment variables
✅ **Runtime Validation** - Catches missing variables on app startup, not at runtime
✅ **Type Safety** - No typos, no undefined variables
✅ **Clear Error Messages** - Helpful instructions when variables are missing
✅ **Documentation** - The type system serves as documentation

## Usage Examples

### 1. Client-Side Components

```typescript
// app/components/LoginForm.tsx
'use client'

import { env } from '@/lib/env'

export function LoginForm() {
  const handleLogin = async () => {
    // Safe to use in browser - these are NEXT_PUBLIC_ variables
    console.log('Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('App Environment:', env.NEXT_PUBLIC_APP_ENV)

    // This will show autocomplete for all NEXT_PUBLIC_ variables
  }

  return <form>...</form>
}
```

### 2. Server Components

```typescript
// app/api/users/route.ts
import { env } from '@/lib/env'

export async function GET() {
  // In server-side code, you can access secret keys
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  const paystackSecret = env.PAYSTACK_SECRET_KEY

  // And also public variables
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL

  return Response.json({ success: true })
}
```

### 3. API Routes

```typescript
// app/api/payment/route.ts
import { env, isProduction } from '@/lib/env'

export async function POST(request: Request) {
  // Use helper functions to check environment
  if (isProduction) {
    // Use live payment keys
    const key = env.PAYSTACK_SECRET_KEY
  } else {
    // Use test keys in development
    console.log('Using test mode')
  }

  // Access payment gateway credentials
  const paystackPublic = env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  const paystackSecret = env.PAYSTACK_SECRET_KEY

  return Response.json({ success: true })
}
```

### 4. Conditional Server Access

```typescript
// lib/utils/config.ts
import { env, isServer } from '@/lib/env'

export function getConfig() {
  const config = {
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    environment: env.NEXT_PUBLIC_APP_ENV,
  }

  // Only access server variables on the server
  if (isServer()) {
    return {
      ...config,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }

  return config
}
```

### 5. Initializing Supabase

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Client-side Supabase (safe for browser)
export const supabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Server-side Supabase (admin access)
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY // Secret key - never exposed to browser
)
```

### 6. Payment Gateway Initialization

```typescript
// lib/payments/paystack.ts
import { env } from '@/lib/env'

export const paystackConfig = {
  publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  secretKey: env.PAYSTACK_SECRET_KEY, // Only accessible on server
}

// Initialize Paystack on the client
export function initializePaystack() {
  // @ts-ignore
  const handler = PaystackPop.setup({
    key: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    // ...other config
  })
}
```

### 7. Environment-Specific Logic

```typescript
// lib/utils/logger.ts
import { env, isDevelopment, isProduction } from '@/lib/env'

export function log(message: string) {
  if (isDevelopment) {
    console.log(`[DEV] ${message}`)
  } else if (isProduction) {
    // Send to production logging service
    sendToLoggingService(message)
  }
}
```

## Available Variables

### Client-Side (NEXT_PUBLIC_*)

These are safe to use in the browser:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PLASMIC_PROJECT_ID`
- `NEXT_PUBLIC_PLASMIC_TOKEN`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `NEXT_PUBLIC_REMITA_MERCHANT_ID`
- `NEXT_PUBLIC_REMITA_SERVICE_TYPE_ID`
- `NEXT_PUBLIC_OPAY_MERCHANT_ID`
- `NEXT_PUBLIC_OPAY_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_APP_URL`

### Server-Side Only

These are NEVER exposed to the browser:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `PAYSTACK_SECRET_KEY`
- `REMITA_API_KEY`
- `OPAY_SECRET_KEY`

## Helper Functions

```typescript
import { env, isProduction, isDevelopment, isStaging, isServer } from '@/lib/env'

// Check environment
if (isProduction) {
  // Production-only code
}

if (isDevelopment) {
  // Development-only code
}

// Check if code is running on server
if (isServer()) {
  // Access server-only variables
  const secret = env.SUPABASE_SERVICE_ROLE_KEY
}
```

## Error Handling

If a required variable is missing, you'll see a helpful error message:

```
❌ Environment Variable Validation Failed!

Required client-side environment variables are not properly configured.

Missing variables (not defined in .env.local):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

How to fix:
1. Copy .env.example to .env.local:
   cp .env.example .env.local

2. Fill in the missing/empty values in .env.local

3. Restart your development server

See .env.example for guidance on where to get these values.
```

## Testing

Run the validation test to check your environment:

```bash
node scripts/test-env-validation.mjs
```

This will show you:
- Which variables have values ✅
- Which variables are empty ⚠️
- Which variables are missing ❌

## Best Practices

### ✅ DO

```typescript
import { env } from '@/lib/env'

// Use the validated env object
const url = env.NEXT_PUBLIC_SUPABASE_URL

// Use helper functions
if (isProduction) {
  // ...
}
```

### ❌ DON'T

```typescript
// Don't use process.env directly
const url = process.env.NEXT_PUBLIC_SUPABASE_URL // No type safety!

// Don't access server variables in client components
'use client'
const secret = env.SUPABASE_SERVICE_ROLE_KEY // Will be empty/undefined!
```

## Troubleshooting

### "Module not found: @/lib/env"

Make sure your `tsconfig.json` has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Environment Variable Validation Failed"

1. Check your `.env.local` file exists
2. Make sure all required variables are uncommented
3. Fill in empty values
4. Restart your dev server

### Type Errors in IDE

Restart your TypeScript server:
- VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

## Migration Guide

If you're migrating from `process.env`:

### Before:

```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### After:

```typescript
import { env } from '@/lib/env'

const url = env.NEXT_PUBLIC_SUPABASE_URL // Now with autocomplete!
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY // And validation!
```

## Summary

The `env` module provides:
- ✅ Type-safe environment variable access
- ✅ Autocomplete in your IDE
- ✅ Runtime validation on startup
- ✅ Clear separation between client and server variables
- ✅ Helpful error messages

Always import from `@/lib/env` instead of using `process.env` directly!
