export const convertToHours = (
  duration: number,
  unit: "day" | "hour"
): number => {
  switch (unit) {
    case "hour":
      return Number(duration);
    case "day":
      return duration * 24;
    default:
      throw new Error("Unsupported duration unit");
  }
};
