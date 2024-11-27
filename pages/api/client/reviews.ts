import sql from "@/lib/db";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    interface QueryParams {
      limit?: number;
      page?: number;
      search?: string;
      id?: number;
    }

    const { limit, page, search = "", id }: QueryParams = request.query;

    const searchTerm = `%${search}%`;

    let query = `
      SELECT r.*, d.title AS destination_title, d.id AS destination_id
      FROM reviews r
      JOIN destination d ON d.id = r.destination_id
      WHERE r.user_name ILIKE $1
    `;

    let countQuery = `
      SELECT COUNT(*)
      FROM reviews r
      JOIN destination d ON d.id = r.destination_id
      WHERE r.user_name ILIKE $1
      OR d.title ILIKE $1
    `;

    const queryParams: (string | number)[] = [searchTerm];
    const countQueryParams: (string | number)[] = [searchTerm];

    if (id) {
      query += ` AND r.id = $2`;
      countQuery += ` AND r.id = $2`;
      queryParams.push(id);
      countQueryParams.push(id);
    }
    if (limit && page) {
      const limitValue = Number(limit) || 10;
      const offsetValue = (Number(page) - 1) * limitValue || 0;

      const startParamIndex = id ? 3 : 2;

      query += ` LIMIT $${startParamIndex} OFFSET $${startParamIndex + 1}`;
      countQuery += ` LIMIT $${startParamIndex} OFFSET $${startParamIndex + 1}`;

      queryParams.push(limitValue, offsetValue);
      countQueryParams.push(limitValue, offsetValue);
    }

    try {
      const [{ rows }, { rows: totalRows }] = await Promise.all([
        sql.query(query, queryParams),
        sql.query(countQuery, countQueryParams),
      ]);

      return successResponse(
        response,
        "GET",
        "review",
        rows,
        totalRows[0].count
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "POST") {
    try {
      const { destination_id, user_name, rating, created_at, comments } =
        request.body;

      if (!destination_id) {
        return errorResponse(response, "id is required");
      }

      const query = {
        text: `
          INSERT INTO reviews (user_name, rating, created_at, comments, destination_id)
          VALUES ($1, $2, $3, $4, $5)`,
        values: [user_name, rating, created_at, comments, destination_id],
      };

      const { rowCount } = await sql.query(query);

      if (rowCount ?? 0 > 0) {
        return successResponse(response, "POST", "reviews");
      } else {
        return errorResponse(response, "Failed to submit the review");
      }
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
