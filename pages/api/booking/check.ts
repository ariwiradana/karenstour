import { NextApiResponse, NextApiRequest } from "next";
import { sql } from "@vercel/postgres";
import { errorResponse, successResponse } from "@/utils/response";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    const { id } = request.query;

    if (id) {
      try {
        const { rows } = await sql.query(
          `SELECT * FROM booking WHERE id = $1`,
          [id]
        );
        return successResponse(response, "GET", "check booking", rows[0]);
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  }
}
