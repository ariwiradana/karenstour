export function convertToSlug(str: string) {
  // Convert to lowercase
  let formattedTitle = str.toLowerCase();

  // Remove non-alphabetical characters (excluding spaces)
  formattedTitle = formattedTitle.replace(/[^a-z\s]/g, "");

  // Replace spaces with hyphens
  formattedTitle = formattedTitle.replace(/\s+/g, "-");

  return formattedTitle;
}
