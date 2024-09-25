import { NextApiResponse } from "next";

export const successResponse = (
  res: NextApiResponse,
  action: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  entity: string,
  data: any = null,
  totalRows: number = 0
): void => {
  let message = "";

  switch (action) {
    case "GET":
      message = `Successfully retrieved ${entity}(s).`;
      break;
    case "POST":
      message = `Successfully created a new ${entity}.`;
      break;
    case "PATCH":
      message = `Successfully updated the ${entity}.`;
      break;
    case "DELETE":
      message = `Successfully deleted the ${entity}.`;
      break;
    default:
      message = `Operation on ${entity} completed successfully.`;
  }

  res.status(200).json({
    success: true,
    message,
    data,
    totalRows,
  });
};

export const errorResponse = (res: NextApiResponse, error: any): void => {
  console.log("Error : ", error.message);
  res.status(500).json({ success: false, message: error.message });
};
