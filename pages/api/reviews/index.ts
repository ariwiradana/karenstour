import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryID } from "@/utils/getCloudinaryId";
import { Review } from "@/constants/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
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
  } else if (request.method === "DELETE") {
    try {
      const { id } = request.query;
      if (!id) {
        return errorResponse(response, "id is required");
      }

      const { rows } = await sql.query(
        `SELECT photos FROM reviews WHERE id = $1`,
        [id]
      );

      if (rows[0]) {
        const currentReview: Review = rows[0];
        if (currentReview.photos && currentReview.photos.length > 0) {
          const env = process.env.NODE_ENV || "development";
          const publicIds = currentReview.photos.map(
            (p) => `${env}/${getCloudinaryID(p)}`
          );
          await cloudinary.api.delete_resources(publicIds);
        }
        await sql.query(`DELETE FROM reviews WHERE id = $1`, [id]);
        return successResponse(response, "DELETE", "reviews");
      }
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
};

export default withAuth(handler);
