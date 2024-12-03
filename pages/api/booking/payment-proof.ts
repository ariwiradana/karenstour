import { NextApiResponse, NextApiRequest } from "next";
import { errorResponse, successResponse } from "@/utils/response";
import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      const { id, url } = request.body;
      const res = await sql.query(
        `UPDATE booking SET payment_proof = $1 WHERE id = $2 RETURNING *`,
        [url, id]
      );
      return successResponse(response, "POST", "payment proof booking", res);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "GET") {
    const { id } = request.query;

    if (id) {
      try {
        const { rows } = await sql.query(
          `SELECT * FROM proof_payment WHERE id = $1`,
          [id]
        );
        return successResponse(response, "GET", "proof payment", rows[0]);
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  }
};

export default withAuth(handler);
