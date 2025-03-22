import sql from "@/lib/db";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

const INSERT_BOOKING_QUERY = `
  INSERT INTO booking 
  (id, destination_id, name, email, booking_date, status, pax, pickup_location, subtotal, tax, tax_rate, total, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
`;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    try {
      const { limit, page, search = "", id } = request.query;

      const values: (string | number)[] = [];

      let where = "";
      if (id) {
        where = ` WHERE b.id = $${values.length + 1}`;
        values.push(id as string);
      }

      if (search) {
        const searchTerm = `%${search}%`;
        const index = values.length + 1;
        where = `
        WHERE b.id ILIKE $${index}
        b.name ILIKE $${index}
        OR b.email ILIKE $${index}
        OR b.status ILIKE $${index}
        OR b.pickup_location ILIKE $${index}`;
        values.push(searchTerm);
      }

      let SELECT_BOOKINGS_QUERY = `
        SELECT 
          b.*, 
          d.title AS destination_title,
          d.duration AS destination_duration,
          d.minimum_pax AS destination_pax,
          d.inclusions AS destination_inclusions,
          d.price AS destination_price,
          COUNT(*) OVER() AS total_count
        FROM booking b
        LEFT JOIN destination d ON b.destination_id = d.id
        ${where}
        ORDER BY b.updated_at DESC
      `;

      if (limit && page) {
        const limitNumber = Math.min(Number(limit), 100);
        const pageNumber = Math.max(Number(page), 1);
        const offset = (pageNumber - 1) * limitNumber;

        SELECT_BOOKINGS_QUERY += ` LIMIT $${values.length + 1} OFFSET $${
          values.length + 2
        };`;
        values.push(limitNumber, offset);
      }

      const { rows } = await sql.query(SELECT_BOOKINGS_QUERY, values);

      const totalCount = rows.length > 0 ? rows[0].total_count : 0;

      return successResponse(
        response,
        "GET",
        "booking",
        rows.length > 0 ? rows[0] : null,
        totalCount
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
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

      // Basic validation
      if (!id || !destination_id || !name || !email) {
        return response
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
      }

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

      await sql.query(INSERT_BOOKING_QUERY, values);

      return successResponse(response, "POST", "booking");
    } catch (error) {
      console.error("Error inserting booking:", error);
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
