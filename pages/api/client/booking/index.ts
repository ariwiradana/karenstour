import sql from "@/lib/db";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";

const SELECT_BOOKINGS_QUERY = `
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
  WHERE b.id ILIKE $1
  OR b.name ILIKE $1
  OR b.email ILIKE $1
  OR b.status ILIKE $1
  OR b.pickup_location ILIKE $1
  ORDER BY b.updated_at DESC
  LIMIT $2
  OFFSET $3;
`;

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
      const { limit = 10, page = 1, search = "" } = request.query;

      const limitNumber = Math.min(Number(limit), 100); // Limit max results
      const pageNumber = Math.max(Number(page), 1); // Ensure page is at least 1
      const searchTerm = `%${search}%`;
      const offset = (pageNumber - 1) * limitNumber;

      const { rows } = await sql.query(SELECT_BOOKINGS_QUERY, [
        searchTerm,
        limitNumber,
        offset,
      ]);

      const totalCount = rows.length > 0 ? rows[0].total_count : 0;

      return successResponse(response, "GET", "booking", rows, totalCount);
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
