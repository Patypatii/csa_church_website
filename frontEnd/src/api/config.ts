
/**
 * Centralized API configuration and derived constants.
 * This ensures consistency across different environments.
 */

// Base URL for backend API requests
const RAW_SERVER_URI = import.meta.env.VITE_SERVER_URI || '';
export const BASE_URL = RAW_SERVER_URI 
  ? (RAW_SERVER_URI.endsWith('/api') ? RAW_SERVER_URI : `${RAW_SERVER_URI}/api`)
  : '';

// Base URL for static assets (images/uploads)
// We extract the base domain and remove any trailing '/api' if present
export const UPLOAD_BASE = RAW_SERVER_URI.endsWith('/api') 
  ? RAW_SERVER_URI.replace(/\/api$/, '') 
  : RAW_SERVER_URI;

/**
 * Helper to ensure a clean path for image URLs
 */
export const getSafeImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${UPLOAD_BASE}${cleanPath}`;
};
