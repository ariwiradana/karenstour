// pages/api/logout.ts
import { NextApiResponse, NextApiRequest } from "next";
import { serialize } from "cookie"; // Add cookie serialization

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      serialize("authToken", "", {
        maxAge: -1, // Set cookie to expire immediately
        path: "/", // Ensure the cookie is deleted from the entire domain
      })
    );

    // Optionally, you can also respond with a message
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } else {
    // Method Not Allowed
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
}
