import sql from "@/lib/db";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    interface QueryParams {
      destination_id?: number;
    }

    const { destination_id }: QueryParams = request.query;

    let query = `
      SELECT r.*, d.title AS destination_title, d.id AS destination_id
      FROM reviews r
      JOIN destination d ON d.id = r.destination_id
      WHERE r.destination_id = $1
    `;

    query += ` ORDER BY r.created_at DESC`;

    try {
      const { rows } = await sql.query(query, [destination_id]);

      return successResponse(response, "GET", "review", rows);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
