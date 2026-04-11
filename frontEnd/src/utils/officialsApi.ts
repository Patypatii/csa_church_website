import { BASE_URL, UPLOAD_BASE } from "../api/config";

export const API_BASE = `${BASE_URL}/officials`;
export const API_TERMS = `${API_BASE}/terms`;
export const API_ARCHIVE = `${API_BASE}/archive`;
export const API_RESTORE = `${API_BASE}/restore`;
export const API_HISTORY = `${API_BASE}/term`;

export const API_JUMUIYA_BASE = `${BASE_URL}/jumuiya-officials`;
export const API_JUMUIYA_ARCHIVE = `${API_JUMUIYA_BASE}/archive`;
export const API_JUMUIYA_HISTORY = `${API_JUMUIYA_BASE}/term`;
export const API_JUMUIYA_RESTORE = `${API_JUMUIYA_BASE}/restore`;

// Export UPLOAD_BASE for consistency
export { UPLOAD_BASE };
