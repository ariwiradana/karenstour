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
      destination_id?: number;
    }

    const {
      limit,
      page,
      search = "",
      id,
      destination_id,
    }: QueryParams = request.query;

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
      query += ` AND r.id = $${queryParams.length + 1}`;
      countQuery += ` AND r.id = $${countQueryParams.length + 1}`;
      queryParams.push(id);
      countQueryParams.push(id);
    }

    if (destination_id) {
      query += ` AND r.destination_id = $${queryParams.length + 1}`;
      countQuery += ` AND r.destination_id = $${countQueryParams.length + 1}`;
      queryParams.push(destination_id);
      countQueryParams.push(destination_id);
    }

    query += ` ORDER BY r.created_at DESC`;

    if (limit && page) {
      const limitValue = Number(limit) || 10;
      const offsetValue = (Number(page) - 1) * limitValue || 0;

      query += ` LIMIT $${queryParams.length + 1} OFFSET $${
        queryParams.length + 2
      }`;

      queryParams.push(limitValue, offsetValue);
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
      const {
        destination_id,
        user_name,
        rating,
        created_at,
        comments,
        photos,
      } = request.body;

      if (!destination_id) {
        return errorResponse(response, "id is required");
      }

      const query = {
        text: `
          INSERT INTO reviews (user_name, rating, created_at, comments, destination_id, photos)
          VALUES ($1, $2, $3, $4, $5, $6)`,
        values: [
          user_name,
          rating,
          created_at,
          comments,
          destination_id,
          photos,
        ],
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
