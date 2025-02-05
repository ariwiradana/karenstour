import sql from "@/lib/db";
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
      limit,
      page,
      sort,
      order,
      search = "",
      id,
      category_names,
    }: QueryParams = request.query;

    const searchTerm = `%${search}%`;
    const values: (string | number | string[])[] = [searchTerm];

    let text = `
      SELECT 
        d.*, 
        ROUND(AVG(r.rating), 1) AS average_rating, 
        COUNT(r.id) AS review_count
      FROM destination d
      LEFT JOIN reviews r ON d.id = r.destination_id
      WHERE d.title ILIKE $1
    `;

    // Count query
    let countText = `
    SELECT COUNT(DISTINCT d.id) AS total_count
    FROM destination d
    LEFT JOIN reviews r ON d.id = r.destination_id
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
      const categoryNames = category_names.split(","); // ['Airport Transfer', 'Culture']
      const valueIndex = values.length + 1;
      text += ` AND d.categories && $${valueIndex}`;
      countText += ` AND d.categories && $${valueIndex}`; // Also apply to count query
      values.push(categoryNames); // Pass the array of category names as a value
    }

    text += " GROUP BY d.id";

    console.log(text, values);

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
        sql.query(countText, values), // Apply values to both queries
      ]);

      if (slug) {
        const currentDestinationId = rows[0].id;
        const { rows: reviewImages } = await sql.query(
          `SELECT photos FROM reviews WHERE destination_id = $1`,
          [currentDestinationId]
        );
        const images = reviewImages.flatMap((img) => img.photos);
        rows[0].images = [...rows[0].images, ...images];
      }

      return successResponse(response, "GET", "destination", rows, total_count);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
