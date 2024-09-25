import { NextApiResponse, NextApiRequest, PageConfig } from "next";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { errorResponse, successResponse } from "@/utils/response";

const allowedFileTypes: string[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/jpg",
];

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    try {
      const { id, filetype } = request.query;

      if (
        typeof filetype !== "string" ||
        !allowedFileTypes.includes(filetype)
      ) {
        return errorResponse(response, {
          message: `Invalid file type for image. Allowed types: ${allowedFileTypes.join(
            ", "
          )}.`,
        });
      }

      const { url } = await put(
        `payment_proof/${id}.${filetype.split("/")[1]}`,
        request,
        {
          access: "public",
        }
      );

      if (url) {
        const text = `UPDATE booking SET payment_proof = $1 WHERE id = $2 RETURNING *`;
        const values = [url, id];

        const res = await sql.query(text, values);
        return successResponse(response, "POST", "payment proof booking", res);
      }
      return successResponse(response, "POST", "payment proof booking");
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "GET") {
    const { id } = request.query;

    if (id) {
      try {
        const { rows } = await sql`SELECT * FROM proof_payment WHERE id = ${
          id as string
        };`;
        return successResponse(response, "GET", "proof payment", rows[0]);
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
