/**
 * Central API configuration.
 * In development: uses VITE_API_URL from .env.development (defaults to localhost:3000)
 * In production: uses VITE_API_URL from .env.production (set to your Render URL)
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
