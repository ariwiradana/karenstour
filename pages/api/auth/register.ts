import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "@/utils/response";
import sql from "@/lib/db";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return errorResponse(res, { message: "Method not allowed" });
  }

  const { username, password }: { username: string; password: string } =
    req.body;

  try {
    const { rows } = await sql.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (rows.length > 0) {
      return errorResponse(res, {
        message:
          "This username is already in use. Please choose a different username.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users (username, password) VALUES ($1, $2)`,
      values: [username, hashedPassword],
    };
    await sql.query(query);
    return successResponse(res, "POST", "user");
  } catch (error) {
    return errorResponse(res, error);
  }
}
