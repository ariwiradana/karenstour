export function getCloudinaryID(url: string) {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  const id = lastPart.split(".")[0];
  return id;
}
