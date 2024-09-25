export function getFileExtension(file: File | null) {
  // Check if the file has a valid type
  if (!file || !file.type) return "";

  // Get the MIME type and extract the extension
  const mimeType = file.type; // e.g., "application/pdf"
  const extension = mimeType.split("/").pop(); // e.g., "pdf"

  return extension;
}
