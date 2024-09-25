import { errorResponse, successResponse } from "@/utils/response";
import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    try {
      const { limit = 10, page = 1, search = "" } = request.query;

      const limitNumber = Number(limit);
      const pageNumber = Number(page);
      const searchTerm = `%${search}%`;

      const offset = (pageNumber - 1) * limitNumber;

      const { rows } = await sql`
        SELECT 
            b.*, 
            d.title as destination_title,
            d.duration as destination_duration,
            d.minimum_pax as destination_pax,
            d.inclusions as destination_inclusions,
            d.price as destination_price
        FROM booking b
        LEFT JOIN destination d 
            ON b.destination_id = d.id
        WHERE b.id ILIKE ${searchTerm}
        OR b.name ILIKE ${searchTerm}
        OR b.email ILIKE ${searchTerm}
        OR b.status ILIKE ${searchTerm}
        OR b.pickup_location ILIKE ${searchTerm}
        ORDER BY b.updated_at DESC
        LIMIT ${limitNumber}
        OFFSET ${offset};
    `;

      const { rows: totalRows } = await sql`
        SELECT COUNT(*)
        FROM booking b
        LEFT JOIN destination d 
            ON b.destination_id = d.id
        WHERE b.id ILIKE ${searchTerm}
        OR b.name ILIKE ${searchTerm}
        OR b.email ILIKE ${searchTerm}
        OR b.status ILIKE ${searchTerm}
      `;

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

      await sql`
      INSERT INTO booking 
      (id, destination_id, name, email, booking_date, status, pax, pickup_location, subtotal, tax, tax_rate, total, created_at, updated_at)
      VALUES (
        ${id}, ${destination_id}, ${name}, ${email}, ${booking_date}, ${status}, ${pax}, ${pickup_location}, ${subtotal}, 
        ${tax}, ${tax_rate}, ${total}, ${created_at}, ${updated_at}
      );
    `;

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
}
