import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "GET") {
    try {
      const { limit = 10, page = 1, search = "" } = request.query;

      const limitNumber = Number(limit);
      const pageNumber = Number(page);
      const searchTerm = `%${search}%`;

      const offset = (pageNumber - 1) * limitNumber;

      const { rows } = await sql.query(
        `
            SELECT 
                b.*, 
                d.title AS destination_title,
                d.duration AS destination_duration,
                d.minimum_pax AS destination_pax,
                d.inclusions AS destination_inclusions,
                d.price AS destination_price
            FROM booking b
            LEFT JOIN destination d 
                ON b.destination_id = d.id
            WHERE b.id ILIKE $1
            OR b.name ILIKE $1
            OR b.email ILIKE $1
            OR b.status ILIKE $1
            OR b.pickup_location ILIKE $1
            ORDER BY b.updated_at DESC
            LIMIT $2
            OFFSET $3;
        `,
        [searchTerm, limitNumber, offset]
      );

      const { rows: totalRows } = await sql.query(
        `
            SELECT COUNT(*)
            FROM booking b
            LEFT JOIN destination d 
                ON b.destination_id = d.id
            WHERE b.id ILIKE $1
            OR b.name ILIKE $1
            OR b.email ILIKE $1
            OR b.status ILIKE $1;
        `,
        [searchTerm]
      );

      return successResponse(
        response,
        "GET",
        "booking",
        rows,
        totalRows[0].count
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "POST") {
    try {
      const data = request.body;
      const {
        id,
        destination_id,
        name,
        email,
        booking_date,
        status,
        pax,
        pickup_location,
        subtotal,
        tax,
        tax_rate,
        total,
        created_at,
        updated_at,
      } = data;

      const query = `
        INSERT INTO booking 
        (id, destination_id, name, email, booking_date, status, pax, pickup_location, subtotal, tax, tax_rate, total, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
      `;

      const values = [
        id,
        destination_id,
        name,
        email,
        booking_date,
        status,
        pax,
        pickup_location,
        subtotal,
        tax,
        tax_rate,
        total,
        created_at,
        updated_at,
      ];

      await sql.query(query, values);

      return successResponse(response, "POST", "booking");
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "PATCH") {
    try {
      const { updates } = request.body;
      const { id } = request.query;

      const updateKeys = Object.keys(updates);
      const setClause = updateKeys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
      const values = updateKeys.map((key) => updates[key]);

      const query = `
        UPDATE booking
        SET ${setClause}
        WHERE id = $${updateKeys.length + 1}
        RETURNING *;
      `;

      values.push(id);
      await sql.query(query, values);
      return successResponse(response, "PATCH", "booking");
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
