import { Destination } from "@/constants/types";
import { errorResponse, successResponse } from "@/utils/response";
import { del } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { url, destination_id, category } = request.query;

  try {
    // Delete the file from blob storage
    await del(url as string);

    // Fetch the destination by id
    const queryGet = {
      text: "SELECT * FROM destination WHERE id = $1",
      values: [destination_id],
    };
    const { rows: destinationRows } = await sql.query(queryGet);

    if (destinationRows.length === 0) {
      return errorResponse(response, "Destination not found");
    }

    const currentDestination: Destination = destinationRows[0];

    // Handle the category dynamically for images or video_url
    if (category === "images") {
      currentDestination.images = currentDestination.images.filter(
        (item: string) => item !== url
      );
    } else if (category === "video_url") {
      // Just replace the video_url with the new URL from the request
      currentDestination.video_url = url as string;
    } else {
      return errorResponse(response, "Invalid category");
    }

    const {
      images,
      title,
      slug,
      minimum_pax,
      description,
      duration,
      price,
      inclusions,
      video_url,
      id,
    } = currentDestination;

    // Update the destination with the modified data
    const query = {
      text: `
        UPDATE destination
        SET images = $1, title = $2, slug = $3, minimum_pax = $4,
            description = $5, duration = $6, price = $7,
            inclusions = $8, video_url = $9
        WHERE id = $10
        RETURNING *;
      `,
      values: [
        images, // Array of strings for images
        title,
        slug,
        minimum_pax,
        description,
        duration,
        price,
        inclusions,
        video_url, // String for video_url
        id,
      ],
    };

    const { rows } = await sql.query(query);

    // Respond with success
    return successResponse(response, "POST", "delete file", rows);
  } catch (error) {
    // Handle any errors that occur
    return errorResponse(response, error);
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
