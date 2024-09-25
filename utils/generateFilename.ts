export function generateFilename(category: string) {
  const timestamp = Date.now(); // Current timestamp
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${category}_${timestamp}_${randomString}`;
}
