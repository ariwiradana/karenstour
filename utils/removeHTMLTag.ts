export function removeHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}
