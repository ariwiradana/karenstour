import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const result = await sql.query("SELECT 1;");
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json(error);
  }
}
