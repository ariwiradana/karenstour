export function convertHoursToReadableFormat(hours: number) {
  if (hours < 1) {
    return "Less than 1 Hour";
  } else if (hours === 1) {
    return "1 Hour";
  } else if (hours < 24) {
    return `${hours} Hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    let result = `${days} Day${days > 1 ? "s" : ""}`;
    if (remainingHours > 0) {
      result += ` and ${remainingHours} Hour${remainingHours > 1 ? "s" : ""}`;
    }

    return result;
  }
}
