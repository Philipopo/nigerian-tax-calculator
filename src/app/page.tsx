import * as React from 'react';
import { PlasmicComponent } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '@/lib/plasmic-init';

export default async function HomePage() {
  const plasmicData = await PLASMIC.maybeFetchComponentData('Homepage');

  if (!plasmicData) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Welcome to Nigerian Tax Calculator</h1>
        <p>This app is connected to Plasmic Studio.</p>
        <p>To get started:</p>
        <ol>
          <li>Make sure your dev server is running on <code>http://localhost:3000</code></li>
          <li>Go to Plasmic Studio and connect to <code>http://localhost:3000/plasmic-host</code></li>
          <li>Create a component named &quot;Homepage&quot; in Plasmic Studio</li>
          <li>This page will automatically render your Plasmic content</li>
        </ol>
        <p><strong>Environment:</strong></p>
        <ul>
          <li>Project ID: {process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID ? '✓ Set' : '✗ Missing'}</li>
          <li>Token: {process.env.NEXT_PUBLIC_PLASMIC_TOKEN ? '✓ Set' : '✗ Missing'}</li>
        </ul>
      </div>
    );
  }

  return <PlasmicComponent component="Homepage" />;
}