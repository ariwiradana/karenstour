import { NextApiResponse, NextApiRequest } from "next";
import { errorResponse, successResponse } from "@/utils/response";
import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "GET") {
    const { id } = request.query;

    if (id) {
      try {
        const { rows } = await sql.query(
          `SELECT * FROM booking WHERE id = $1`,
          [id]
        );
        return successResponse(response, "GET", "check booking", rows[0]);
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  }
};

export default withAuth(handler);
