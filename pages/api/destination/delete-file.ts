import { Destination } from "@/constants/types";
import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";
import { errorResponse, successResponse } from "@/utils/response";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryID } from "@/utils/getCloudinaryId";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { url, destination_id, category } = request.query;

  try {
    const publicId = getCloudinaryID(url as string);
    await cloudinary.uploader.destroy(publicId);

    const queryGet = {
      text: "SELECT * FROM destination WHERE id = $1",
      values: [destination_id],
    };
    const { rows: destinationRows } = await sql.query(queryGet);

    if (destinationRows.length === 0) {
      return errorResponse(response, "Destination not found");
    }

    const currentDestination: Destination = destinationRows[0];

    if (category === "images") {
      if (currentDestination.thumbnail_image === url) {
        currentDestination["thumbnail_image"] = "";
      }
      currentDestination["images"] = currentDestination.images.filter(
        (item: string) => item !== url
      );
    } else if (category === "video_url") {
      currentDestination["video_url"] = "";
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
      thumbnail_image,
      id,
    } = currentDestination;

    const query = {
      text: `
          UPDATE destination
          SET images = $1, title = $2, slug = $3, minimum_pax = $4,
              description = $5, duration = $6, price = $7,
              inclusions = $8, video_url = $9, thumbnail_image = $10
          WHERE id = $11
          RETURNING *;
        `,
      values: [
        images,
        title,
        slug,
        minimum_pax,
        description,
        duration,
        price,
        inclusions,
        video_url,
        thumbnail_image,
        id,
      ],
    };

    const { rows } = await sql.query(query);
    return successResponse(response, "POST", "delete file", rows);
  } catch (error) {
    // Handle any errors that occur
    return errorResponse(response, error);
  }
};

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default withAuth(handler);
