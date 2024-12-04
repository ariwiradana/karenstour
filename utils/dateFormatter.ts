import moment from "moment";

export const formatDate = (date: string | Date): string => {
  const momentDate = moment(date);
  return momentDate.format("D MMMM YYYY");
};
