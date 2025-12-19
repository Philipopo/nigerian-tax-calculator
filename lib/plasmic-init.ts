"use client";

import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";

/**
 * Plasmic Loader Configuration
 * This connects your Next.js app to your Plasmic Studio project
 */
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID!,
      token: process.env.NEXT_PUBLIC_PLASMIC_TOKEN!,
    },
  ],
  // Preview mode for development
  preview: process.env.NODE_ENV === 'development',
});