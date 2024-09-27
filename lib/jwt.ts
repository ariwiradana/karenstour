// utils/jwt.ts
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { errorResponse } from "@/utils/response";

export function verifyToken(
  request: NextApiRequest,
  response: NextApiResponse
): JwtPayload | null {
  const cookie = request.headers.cookie || "";
  const authToken = parse(cookie).authToken;

  // Check if authToken exists
  if (!authToken) {
    errorResponse(response, { message: "Unauthorized" });
    return null; // Return null if unauthorized
  }

  try {
    // Verify the token and return the decoded payload
    return jwt.verify(
      authToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(response, { message: "Invalid token." });
    } else if (error instanceof jwt.TokenExpiredError) {
      errorResponse(response, { message: "Token expired." });
    } else {
      errorResponse(response, {
        message: "Something went wrong. Please try again.",
      });
    }
    return null;
  }
}
