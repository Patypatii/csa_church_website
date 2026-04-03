
// utils/fileHelpers.ts
export const normalizeFiles = (files: File[] | File | null | undefined): File[] => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};
