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
    const values: (string | number)[] = [searchTerm];

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
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
