# Environment Variable System

This directory contains the runtime environment variable validation and type-safe access system for the Nigerian Tax Calculator project.

## Files

- **[env.ts](./env.ts)** - Main environment validation module with TypeScript types
- **[env-usage-examples.md](./env-usage-examples.md)** - Comprehensive usage guide with examples

## Quick Start

```typescript
import { env } from '@/lib/env'

// All environment variables with TypeScript autocomplete!
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
```

## Features

✅ **Runtime Validation** - Catches missing environment variables on app startup
✅ **TypeScript Types** - Full autocomplete and type safety for all variables
✅ **Helpful Errors** - Clear error messages with instructions when variables are missing
✅ **Server/Client Safety** - Prevents accidental exposure of secrets to the browser
✅ **Environment Helpers** - `isProduction`, `isDevelopment`, `isStaging` utilities

## Testing

Test your environment configuration:

```bash
node scripts/test-env-validation.mjs
```

This will show you which variables are:
- ✅ Configured correctly
- ⚠️ Empty (need values)
- ❌ Missing (need to be added)

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all required values in `.env.local`

3. Start your app - validation runs automatically:
   ```bash
   npm run dev
   ```

If any variables are missing, you'll see a clear error message with instructions.

## Documentation

See [env-usage-examples.md](./env-usage-examples.md) for:
- Complete usage examples
- All available variables
- Helper functions
- Best practices
- Troubleshooting guide
- Migration guide from `process.env`

## Type Definitions

The system defines two interfaces:

**ClientEnv** - Variables safe for browser (NEXT_PUBLIC_*)
```typescript
interface ClientEnv {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_PLASMIC_PROJECT_ID: string
  // ... all NEXT_PUBLIC_ variables
}
```

**ServerEnv** - Server-only secrets (NEVER exposed to browser)
```typescript
interface ServerEnv {
  SUPABASE_SERVICE_ROLE_KEY: string
  PAYSTACK_SECRET_KEY: string
  RECAPTCHA_SECRET_KEY: string
  // ... all secret keys
}
```

## Best Practices

### ✅ DO
- Import `env` from `@/lib/env`
- Use TypeScript autocomplete
- Check `isServer()` before accessing server variables in shared code

### ❌ DON'T
- Use `process.env` directly
- Access server variables in client components
- Commit `.env.local` to Git

## Related Files

- [.env.example](../../.env.example) - Template with all required variables
- [.env.local](../../.env.local) - Your actual environment file (not in Git)
- [scripts/test-env-validation.mjs](../../scripts/test-env-validation.mjs) - Test script
