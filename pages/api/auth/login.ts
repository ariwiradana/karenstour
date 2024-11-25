import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "@/utils/response";
import { User } from "@/constants/types";
import sql from "@/lib/db";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return errorResponse(res, {
      message: "Method not allowed",
    });
  }

  const { username, password } = req.body;

  try {
    const queryCheck = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const { rows, rowCount } = await sql.query(queryCheck);

    if (rowCount === 0) {
      return errorResponse(res, { message: "Username not found." });
    }

    const user: User = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return errorResponse(res, { message: "Incorrect password." });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
      expiresIn: "6h",
    });

    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Path=/; Max-Age=21600; Secure; SameSite=Strict`
    );
    return successResponse(res, "LOGIN", "user", { token });
  } catch (error) {
    return errorResponse(res, {
      message: "Something went wrong. Please try again.",
    });
  }
}
