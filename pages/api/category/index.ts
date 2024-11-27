import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

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

    const values: (string | number)[] = [searchTerm];
    const countValues: (string | number)[] = [searchTerm];

    let text = `
      SELECT * FROM category
      WHERE name ILIKE $1
    `;

    let countText = `
      SELECT COUNT(*) FROM category
      WHERE name ILIKE $1
    `;

    if (id) {
      text += ` AND id = $2 ORDER BY name ASC`;
      countText += ` AND id = $2`;
      values.push(id);
      countValues.push(id);
    } else {
      text += ` ORDER BY name ASC`;
    }

    if (limit && page) {
      const valueIndex = values.length + 1;
      const limitValue = Number(limit) || 10;
      const offsetValue = (Number(page) - 1) * limitValue || 0;

      text += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
      countText += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
      values.push(limitValue, offsetValue);
      countValues.push(limitValue, offsetValue);
    }

    try {
      const query = {
        text,
        values,
      };

      const countQuery = {
        text: countText,
        values: countValues,
      };

      const [{ rows }, { rows: totalRows }] = await Promise.all([
        sql.query(query),
        sql.query(countQuery),
      ]);
      return successResponse(
        response,
        "GET",
        "category",
        rows,
        totalRows[0].count
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "POST") {
    try {
      const { name } = request.body;

      if (!name) {
        return errorResponse(response, "Name is required");
      }

      const query = {
        text: `INSERT INTO category (name) VALUES ($1)`,
        values: [name],
      };

      const { rowCount } = await sql.query(query);

      if (rowCount && rowCount > 0) {
        return successResponse(response, "POST", "category");
      } else {
        return errorResponse(response, "Failed to submit the category");
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
      await sql.query(
        `
        DELETE FROM category
        WHERE id = $1`,
        [id]
      );

      return successResponse(response, "DELETE", "category");
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
