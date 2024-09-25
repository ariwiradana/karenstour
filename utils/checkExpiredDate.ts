import moment from "moment";

export function checkExpiredDate(expired_at: string) {
  const expiredDate = moment(expired_at).startOf("day");
  const now = moment().startOf("day");
  const daysDiff = expiredDate.diff(now, "day");
  const hoursDiff = expiredDate.diff(now, "hours");

  if (expiredDate.isBefore(now)) {
    return "Expired";
  } else if (expiredDate.isSame(now, "day")) {
    return `The Booking will be expires in ${hoursDiff} hours`;
  } else if (expiredDate.isSame(now.add(1, "day"), "day")) {
    return "The Booking will be expires tomorrow";
  } else {
    return `The Booking will be expires in ${daysDiff} days`;
  }
}
