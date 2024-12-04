export function getInitials(name: string): string {
  return name
    .split(" ") // Split the name by spaces
    .map((part) => part.charAt(0).toUpperCase()) // Get the first letter of each part and make it uppercase
    .join(""); // Join the initials together
}
