import { Destination } from "@/constants/types";
import { convertToSlug } from "@/utils/convertToSlug";
import { errorResponse, successResponse } from "@/utils/response";
import { del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    interface QueryParams {
      slug?: string;
      limit?: number;
      page?: number;
      sort?: string; // If you want to use different sorting criteria
      order?: string;
      search?: string;
      id?: number;
    }

    const {
      slug,
      limit = 10,
      page = 1,
      sort,
      order,
      search = "",
      id,
    }: QueryParams = request.query;

    const searchTerm = `%${search}%`;

    // Base query
    let query = `
      SELECT d.*, ROUND(AVG(r.rating), 1) AS average_rating, COUNT(r.id) AS review_count
      FROM destination d
      LEFT JOIN reviews r ON d.id = r.destination_id
      WHERE d.title ILIKE '${searchTerm}'
    `;

    // Base count query
    let countQuery = `
      SELECT COUNT(*)
      FROM destination
      WHERE title ILIKE '${searchTerm}'
    `;

    if (id) {
      query += ` AND d.id = '${id}'`;
    }

    // Append optional conditions
    if (slug) {
      query += ` AND d.slug = '${slug}'`;
      countQuery += ` AND slug = '${slug}'`;
    }

    query += " GROUP BY d.id"; // Ensure you're grouping by destination ID

    // Append sorting logic
    if (sort) {
      if (sort === "popularity") {
        query += ` ORDER BY average_rating ${order}`; // Sort by average rating for popularity
      } else {
        query += ` ORDER BY ${sort} ${order}`; // Existing sort logic
      }
    } else {
      query += ` ORDER BY average_rating DESC`; // Default to sort by average rating
    }

    // Handle pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [{ rows }, { rows: totalRows }] = await Promise.all([
        sql.query(query),
        sql.query(countQuery),
      ]);

      return successResponse(
        response,
        "GET",
        "destination",
        rows,
        totalRows[0].count
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "POST") {
    try {
      const {
        images,
        title,
        minimum_pax,
        description,
        duration,
        price,
        inclusions,
        video_url,
      }: Destination = request.body;

      const query = {
        text: `
          INSERT INTO destination (images, title, slug, minimum_pax, description, duration, price, inclusions, video_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
        `,
        values: [
          images,
          title,
          convertToSlug(title),
          minimum_pax,
          description,
          duration,
          price,
          inclusions,
          video_url,
        ],
      };
      const { rows } = await sql.query(query);
      return successResponse(response, "POST", "destination", rows);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "PUT") {
    try {
      const {
        images,
        title,
        slug,
        minimum_pax,
        description,
        duration,
        price,
        inclusions,
        video_url,
      }: Destination = request.body;

      const { id } = request.query;

      const query = {
        text: `
                UPDATE destination
                SET images = $1, title = $2, slug = $3, minimum_pax = $4,
                    description = $5, duration = $6, price = $7,
                    inclusions = $8, video_url = $9
                WHERE id = $10
                RETURNING *;
            `,
        values: [
          images,
          title,
          slug,
          minimum_pax,
          description,
          duration,
          price,
          inclusions,
          video_url,
          id,
        ],
      };
      const { rows } = await sql.query(query);
      return successResponse(response, "PUT", "destination", rows);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "DELETE") {
    try {
      const { id } = request.query;
      if (!id) {
        return errorResponse(response, "id is required");
      }
      const queryGet = {
        text: "SELECT images, video_url FROM destination WHERE id = $1",
        values: [id],
      };

      const { rows: destinationRows } = await sql.query(queryGet);

      if (destinationRows.length === 0) {
        return errorResponse(response, "Destination not found");
      }

      const imagesURLS = destinationRows[0].images ?? [];
      const videoURL = destinationRows[0].video_url ?? "";

      const allURLS = [...imagesURLS];

      if (videoURL) {
        allURLS.push(videoURL);
      }

      const queryDelete = {
        text: "DELETE FROM destination WHERE id = $1 RETURNING *;",
        values: [id],
      };

      await sql.query(queryDelete);

      for (const allURL of allURLS) {
        await del(allURL);
      }

      return successResponse(response, "DELETE", "destination");
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
