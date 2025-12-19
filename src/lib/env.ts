/**
 * Environment Variables Validation and Type Definitions
 *
 * This module provides:
 * 1. Runtime validation of required environment variables
 * 2. TypeScript autocomplete for all env vars
 * 3. Type-safe access to environment variables
 * 4. Helpful error messages when variables are missing
 *
 * Import and use the validated env object instead of process.env directly:
 * @example
 * import { env } from '@/lib/env'
 * const url = env.NEXT_PUBLIC_SUPABASE_URL // TypeScript autocomplete!
 */

// ===========================================
// TYPE DEFINITIONS
// ===========================================

/**
 * Client-side environment variables (safe to expose in browser)
 * These are embedded in the JavaScript bundle and visible to users
 */
interface ClientEnv {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

  // Plasmic
  NEXT_PUBLIC_PLASMIC_PROJECT_ID: string;
  NEXT_PUBLIC_PLASMIC_TOKEN: string;

  // reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;

  // Payment Gateways - Public Keys
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: string;
  NEXT_PUBLIC_REMITA_MERCHANT_ID: string;
  NEXT_PUBLIC_REMITA_SERVICE_TYPE_ID: string;
  NEXT_PUBLIC_OPAY_MERCHANT_ID: string;
  NEXT_PUBLIC_OPAY_PUBLIC_KEY: string;

  // App Configuration
  NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
  NEXT_PUBLIC_APP_URL: string;
}

/**
 * Server-side environment variables (NEVER exposed to browser)
 * These should only be accessed in API routes, server components, or server-side code
 */
interface ServerEnv {
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: string;

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: string;

  // Payment Gateways - Secret Keys
  PAYSTACK_SECRET_KEY: string;
  REMITA_API_KEY: string;
  OPAY_SECRET_KEY: string;
}

/**
 * Complete environment variables type
 */
type Env = ClientEnv & ServerEnv;

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

/**
 * Validates that all required client-side (NEXT_PUBLIC_*) variables are present
 * This runs both on client and server
 */
function validateClientEnv(): ClientEnv {
  const requiredClientVars: (keyof ClientEnv)[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_PLASMIC_PROJECT_ID',
    'NEXT_PUBLIC_PLASMIC_TOKEN',
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
    'NEXT_PUBLIC_REMITA_MERCHANT_ID',
    'NEXT_PUBLIC_REMITA_SERVICE_TYPE_ID',
    'NEXT_PUBLIC_OPAY_MERCHANT_ID',
    'NEXT_PUBLIC_OPAY_PUBLIC_KEY',
    'NEXT_PUBLIC_APP_ENV',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missing: string[] = [];
  const empty: string[] = [];

  for (const varName of requiredClientVars) {
    const value = process.env[varName];

    if (value === undefined) {
      missing.push(varName);
    } else if (value.trim() === '') {
      empty.push(varName);
    }
  }

  if (missing.length > 0 || empty.length > 0) {
    const errorParts: string[] = [
      '❌ Environment Variable Validation Failed!',
      '',
      'Required client-side environment variables are not properly configured.',
      '',
    ];

    if (missing.length > 0) {
      errorParts.push('Missing variables (not defined in .env.local):');
      missing.forEach(varName => {
        errorParts.push(`  - ${varName}`);
      });
      errorParts.push('');
    }

    if (empty.length > 0) {
      errorParts.push('Empty variables (defined but have no value):');
      empty.forEach(varName => {
        errorParts.push(`  - ${varName}`);
      });
      errorParts.push('');
    }

    errorParts.push('How to fix:');
    errorParts.push('1. Copy .env.example to .env.local:');
    errorParts.push('   cp .env.example .env.local');
    errorParts.push('');
    errorParts.push('2. Fill in the missing/empty values in .env.local');
    errorParts.push('');
    errorParts.push('3. Restart your development server');
    errorParts.push('');
    errorParts.push('See .env.example for guidance on where to get these values.');

    throw new Error(errorParts.join('\n'));
  }

  return requiredClientVars.reduce((acc, key) => {
    acc[key] = process.env[key] as any;
    return acc;
  }, {} as ClientEnv);
}

/**
 * Validates that all required server-side variables are present
 * Only runs on the server (Node.js environment)
 */
function validateServerEnv(): ServerEnv {
  // Skip validation on client-side
  if (typeof window !== 'undefined') {
    // Return empty object on client - server vars are not accessible anyway
    return {} as ServerEnv;
  }

  const requiredServerVars: (keyof ServerEnv)[] = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'RECAPTCHA_SECRET_KEY',
    'PAYSTACK_SECRET_KEY',
    'REMITA_API_KEY',
    'OPAY_SECRET_KEY',
  ];

  const missing: string[] = [];
  const empty: string[] = [];

  for (const varName of requiredServerVars) {
    const value = process.env[varName];

    if (value === undefined) {
      missing.push(varName);
    } else if (value.trim() === '') {
      empty.push(varName);
    }
  }

  if (missing.length > 0 || empty.length > 0) {
    const errorParts: string[] = [
      '❌ Server Environment Variable Validation Failed!',
      '',
      'Required server-side (secret) environment variables are not properly configured.',
      '',
      '⚠️  WARNING: These variables should NEVER be prefixed with NEXT_PUBLIC_',
      '   They contain sensitive data and must remain server-side only!',
      '',
    ];

    if (missing.length > 0) {
      errorParts.push('Missing variables (not defined in .env.local):');
      missing.forEach(varName => {
        errorParts.push(`  - ${varName}`);
      });
      errorParts.push('');
    }

    if (empty.length > 0) {
      errorParts.push('Empty variables (defined but have no value):');
      empty.forEach(varName => {
        errorParts.push(`  - ${varName}`);
      });
      errorParts.push('');
    }

    errorParts.push('How to fix:');
    errorParts.push('1. Check your .env.local file');
    errorParts.push('');
    errorParts.push('2. Fill in the missing/empty SECRET variables');
    errorParts.push('   (Do NOT add NEXT_PUBLIC_ prefix to these!)');
    errorParts.push('');
    errorParts.push('3. Restart your development server');
    errorParts.push('');
    errorParts.push('See .env.example for guidance on where to get these values.');

    throw new Error(errorParts.join('\n'));
  }

  return requiredServerVars.reduce((acc, key) => {
    acc[key] = process.env[key] as any;
    return acc;
  }, {} as ServerEnv);
}

/**
 * Validates all environment variables (both client and server)
 */
function validateEnv(): Env {
  const clientEnv = validateClientEnv();
  const serverEnv = validateServerEnv();

  return {
    ...clientEnv,
    ...serverEnv,
  };
}

// ===========================================
// EXPORTED ENV OBJECT
// ===========================================

/**
 * Validated environment variables with TypeScript autocomplete
 *
 * Usage:
 * - Client-side: All NEXT_PUBLIC_* variables are available
 * - Server-side: All variables (public + secret) are available
 *
 * @example
 * // In any component or page
 * import { env } from '@/lib/env'
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
 *
 * @example
 * // In API routes or server components only
 * import { env } from '@/lib/env'
 * const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
 */
export const env = validateEnv();

/**
 * Helper function to check if we're in a specific environment
 */
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging';

/**
 * Type guard to safely access server-only variables
 * Use this in code that runs on both client and server
 *
 * @example
 * if (isServer()) {
 *   const secret = env.SUPABASE_SERVICE_ROLE_KEY
 * }
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Export types for use in other files
 */
export type { ClientEnv, ServerEnv, Env };

// Validate immediately when this module is imported
// This ensures errors are caught as early as possible
console.log('✅ Environment variables validated successfully');
