import { NextApiResponse, NextApiRequest, PageConfig } from "next";
import { errorResponse, successResponse } from "@/utils/response";
import getRawBody from "raw-body";
import { promises as fs } from "fs";
import path from "path";
import sql from "@/lib/db";

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

      const rawBody = await getRawBody(request);
      const fullfilename = `payment_proof/${id}.${filetype.split("/")[1]}`;
      const url = path.join(process.cwd(), "public/uploads", fullfilename);
      await fs.mkdir(path.dirname(url), { recursive: true });
      await fs.writeFile(url, rawBody);
      const insertedURL = `/uploads/${fullfilename}`;

      if (insertedURL) {
        const res = await sql.query(
          `UPDATE booking SET payment_proof = $1 WHERE id = $2 RETURNING *`,
          [insertedURL, id]
        );
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
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
