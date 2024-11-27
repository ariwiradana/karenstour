import { NextApiResponse, NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export const withAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; // Get the token from the header

    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Call the original handler
    return handler(req, res);
  };
};
