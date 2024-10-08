import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    const { slug } = request.query;

    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM destination
        WHERE slug = '${slug}'
      );
    `;

    try {
      const data = await sql.query(query);
      return response.status(200).json({
        status: "success",
        data,
        message: "The requested slug exists.",
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        error,
        message: "An error occurred while getting the destination",
      });
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
