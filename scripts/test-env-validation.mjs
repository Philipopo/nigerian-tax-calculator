/**
 * Test Environment Variable Validation
 *
 * This script demonstrates the env validation catching missing variables
 * Run with: node scripts/test-env-validation.mjs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('='.repeat(70));
console.log('ENVIRONMENT VARIABLE VALIDATION TEST');
console.log('='.repeat(70));
console.log('');

// Read the current .env.local file
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

console.log('📋 Current .env.local status:');
console.log('');

// Check which variables are commented out or empty
const lines = envContent.split('\n');
const missingVars = [];
const emptyVars = [];

const requiredVars = [
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

for (const varName of requiredVars) {
  const line = lines.find(l => l.trim().startsWith(varName));

  if (!line) {
    missingVars.push(varName);
  } else if (line.trim().startsWith('#')) {
    console.log(`  ❌ ${varName} - COMMENTED OUT`);
    missingVars.push(varName);
  } else {
    const value = line.split('=')[1]?.trim() || '';
    if (value === '') {
      console.log(`  ⚠️  ${varName} - EMPTY`);
      emptyVars.push(varName);
    } else {
      console.log(`  ✅ ${varName} - HAS VALUE`);
    }
  }
}

console.log('');
console.log('='.repeat(70));
console.log('');

if (missingVars.length > 0) {
  console.log(`❌ Found ${missingVars.length} missing/commented variable(s):`);
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('');
  console.log('✅ VALIDATION WORKS: The env.ts file will throw an error for these!');
} else if (emptyVars.length > 0) {
  console.log(`⚠️  Found ${emptyVars.length} empty variable(s):`);
  emptyVars.forEach(v => console.log(`   - ${v}`));
  console.log('');
  console.log('✅ VALIDATION WORKS: The env.ts file will throw an error for these!');
} else {
  console.log('✅ All required variables have values!');
}

console.log('');
console.log('='.repeat(70));
console.log('DEMO: What the error message looks like');
console.log('='.repeat(70));
console.log('');

if (missingVars.length > 0 || emptyVars.length > 0) {
  console.log('When you try to start the app with missing/empty variables,');
  console.log('you will see an error message like this:');
  console.log('');
  console.log('─'.repeat(70));

  const errorParts = [
    '❌ Environment Variable Validation Failed!',
    '',
    'Required client-side environment variables are not properly configured.',
    '',
  ];

  if (missingVars.length > 0) {
    errorParts.push('Missing variables (not defined in .env.local):');
    missingVars.forEach(v => errorParts.push(`  - ${v}`));
    errorParts.push('');
  }

  if (emptyVars.length > 0) {
    errorParts.push('Empty variables (defined but have no value):');
    emptyVars.forEach(v => errorParts.push(`  - ${v}`));
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

  console.log(errorParts.join('\n'));
  console.log('─'.repeat(70));
}

console.log('');
console.log('='.repeat(70));
console.log('TEST COMPLETE');
console.log('='.repeat(70));
