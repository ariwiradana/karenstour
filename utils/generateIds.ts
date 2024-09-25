export function generateIds(prefix: string): string {
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generates a random string of 8 characters
  const timestamp = Date.now().toString(36).toUpperCase(); // Adds a unique timestamp in base 36
  return `${prefix}-${randomPart}-${timestamp}`;
}
