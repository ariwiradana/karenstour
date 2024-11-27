import { NextApiResponse, NextApiRequest } from "next";
import { errorResponse, successResponse } from "@/utils/response";
import sql from "@/lib/db";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    const { id } = request.query;

    if (!id) {
      return errorResponse(response, { message: "ID is required" });
    }

    try {
      const { rows } = await sql.query(`SELECT * FROM booking WHERE id = $1`, [
        id,
      ]);

      if (rows.length === 0) {
        return errorResponse(response, {
          message: "No booking found with the given ID",
        });
      }

      console.log({ rows });
      return successResponse(response, "GET", "check booking", rows[0]);
    } catch (error) {
      console.error("Database error:", error);
      return errorResponse(response, { message: "Internal Server Error" });
    }
  } else {
    // Handle method not allowed
    return response.status(405).json({ message: "Method Not Allowed" });
  }
}
