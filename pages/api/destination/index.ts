import { Destination } from "@/constants/types";
import sql from "@/lib/db";
import delLocal from "@/lib/delLocal";
import { convertToSlug } from "@/utils/convertToSlug";
import { errorResponse, successResponse } from "@/utils/response";
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
      sort?: string;
      order?: string;
      search?: string;
      id?: number;
      category_names?: string;
    }

    const {
      slug,
      limit, // Default limit
      page, // Default page
      sort,
      order,
      search = "",
      id,
      category_names,
    }: QueryParams = request.query;

    const searchTerm = `%${search}%`;
    const values: (string | number)[] = [searchTerm];

    // Main query
    let text = `
    SELECT 
      d.*, 
      ROUND(AVG(r.rating), 1) AS average_rating, 
      COUNT(r.id) AS review_count, 
      c.id AS category_id, 
      c.name AS category_name
    FROM destination d
    LEFT JOIN reviews r ON d.id = r.destination_id
    LEFT JOIN category c ON d.category_id = c.id
    WHERE d.title ILIKE $1
  `;

    // Count query
    let countText = `
    SELECT COUNT(DISTINCT d.id) AS total_count
    FROM destination d
    LEFT JOIN reviews r ON d.id = r.destination_id
    LEFT JOIN category c ON d.category_id = c.id
    WHERE d.title ILIKE $1
  `;

    // Add filters based on id, slug, and category_names
    if (id) {
      const valueIndex = values.length + 1;
      text += ` AND d.id = $${valueIndex}`;
      countText += ` AND d.id = $${valueIndex}`;
      values.push(id);
    }

    if (slug) {
      const valueIndex = values.length + 1;
      text += ` AND d.slug = $${valueIndex}`;
      countText += ` AND d.slug = $${valueIndex}`;
      values.push(slug);
    }

    if (category_names) {
      const categoryArray = category_names
        .split(",")
        .map((name) => name.trim());
      if (categoryArray.length > 0) {
        const placeholders = categoryArray
          .map((_, i) => `$${values.length + i + 1}`)
          .join(", ");
        text += ` AND c.name ILIKE ANY(ARRAY[${placeholders}])`;
        countText += ` AND c.name ILIKE ANY(ARRAY[${placeholders}])`;
        categoryArray.forEach((name) => {
          values.push(`%${name}%`);
        });
      }
    }

    text += " GROUP BY d.id, c.id";

    // Sorting logic
    const validSortColumns = ["d.duration", "d.price", "average_rating"];
    const validSortOrders = ["ASC", "DESC"];

    if (sort && order) {
      if (
        validSortColumns.includes(sort) &&
        validSortOrders.includes(order.toUpperCase())
      ) {
        text += ` ORDER BY ${sort} ${order.toUpperCase()}`;
      } else {
        return errorResponse(response, {
          message: `Invalid sort category. Allowed sort: ${validSortColumns.join(
            ", "
          )}.`,
        });
      }
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      text += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    try {
      const [
        { rows },
        {
          rows: [{ total_count }],
        },
      ] = await Promise.all([
        sql.query(text, values),
        sql.query(countText, values),
      ]);

      return successResponse(response, "GET", "destination", rows, total_count);
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
        category_id,
      }: Destination = request.body;

      const query = {
        text: `
          INSERT INTO destination (images, title, slug, minimum_pax, description, duration, price, inclusions, video_url, category_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
          category_id,
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
        category_id,
        thumbnail_image,
      }: Destination = request.body;

      const { id } = request.query;

      const query = {
        text: `
                UPDATE destination
                SET images = $1, title = $2, slug = $3, minimum_pax = $4,
                    description = $5, duration = $6, price = $7,
                    inclusions = $8, video_url = $9, category_id = $10, thumbnail_image = $11
                WHERE id = $12
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
          category_id,
          thumbnail_image,
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
        await delLocal(allURL);
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
