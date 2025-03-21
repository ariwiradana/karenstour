import { Destination } from "@/constants/types";
import sql from "@/lib/db";
import { withAuth } from "@/lib/withAuth";
import { convertToSlug } from "@/utils/convertToSlug";
import { errorResponse, successResponse } from "@/utils/response";
import { NextApiResponse, NextApiRequest } from "next";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryID } from "@/utils/getCloudinaryId";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "GET") {
    interface QueryParams {
      slug?: string;
      limit?: number;
      page?: number;
      sort?: string;
      order?: string;
      search?: string;
      id?: number;
    }

    const {
      slug,
      limit, // Default limit
      page, // Default page
      sort,
      order,
      search = "",
      id,
    }: QueryParams = request.query;

    const searchTerm = `%${search}%`;
    const values: (string | number)[] = [searchTerm];

    let text = `
      SELECT 
        d.*, 
        ROUND(AVG(r.rating), 1) AS average_rating, 
        COUNT(r.id) AS review_count
      FROM destination d
      LEFT JOIN reviews r ON d.id = r.destination_id
      WHERE d.title ILIKE $1
    `;

    let countText = `
      SELECT COUNT(DISTINCT d.id) AS total_count
      FROM destination d
      LEFT JOIN reviews r ON d.id = r.destination_id
      WHERE d.title ILIKE $1
    `;

    if (id) {
      const valueIndex = values.length + 1;
      text += ` AND d.id = $${valueIndex}`;
      countText += ` AND d.id = $${valueIndex}`;
      values.push(id);
    }

    if (slug) {
      const valueIndex = values.length + 1;
      text += ` AND d.slug = $${valueIndex}`;
      countText += ` AND d.slug = $${valueIndex}`;
      values.push(slug);
    }

    text += " GROUP BY d.id";

    // Sorting logic
    const validSortColumns = ["d.duration", "d.price", "average_rating"];
    const validSortOrders = ["ASC", "DESC"];

    if (sort && order) {
      if (
        validSortColumns.includes(sort) &&
        validSortOrders.includes(order.toUpperCase())
      ) {
        text += ` ORDER BY ${sort} ${order.toUpperCase()}`;
      } else {
        return errorResponse(response, {
          message: `Invalid sort category. Allowed sort: ${validSortColumns.join(
            ", "
          )}.`,
        });
      }
    } else {
      text += ` ORDER BY d.id DESC`;
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      text += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    try {
      const [
        { rows },
        {
          rows: [{ total_count }],
        },
      ] = await Promise.all([
        sql.query(text, values),
        sql.query(countText, values),
      ]);

      return successResponse(response, "GET", "destination", rows, total_count);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "POST") {
    try {
      const {
        images,
        title,
        minimum_pax,
        description,
        duration,
        price,
        inclusions,
        inventory,
        video_url,
        categories,
      }: Destination = request.body;

      const query = {
        text: `
          INSERT INTO destination (images, title, slug, minimum_pax, description, duration, price, inclusions, video_url, categories, inventory)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `,
        values: [
          images,
          title,
          convertToSlug(title),
          Number(minimum_pax),
          description,
          duration,
          price,
          inclusions,
          video_url,
          categories,
          inventory,
        ],
      };
      const { rows } = await sql.query(query);
      return successResponse(response, "POST", "destination", rows);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "PUT") {
    try {
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
        categories,
        thumbnail_image,
        inventory,
      }: Destination = request.body;

      const { id } = request.query;

      const query = {
        text: `
                UPDATE destination
                SET images = $1, title = $2, slug = $3, minimum_pax = $4,
                    description = $5, duration = $6, price = $7,
                    inclusions = $8, video_url = $9, categories = $10, thumbnail_image = $11, inventory = $12
                WHERE id = $13
                RETURNING *;
            `,
        values: [
          images,
          title,
          slug,
          Number(minimum_pax),
          description,
          duration,
          price,
          inclusions,
          video_url,
          categories,
          thumbnail_image,
          inventory,
          id,
        ],
      };
      const { rows } = await sql.query(query);
      return successResponse(response, "PUT", "destination", rows);
    } catch (error) {
      return errorResponse(response, error);
    }
  } else if (request.method === "DELETE") {
    try {
      const { id } = request.query;
      if (!id) {
        return errorResponse(response, "id is required");
      }
      const queryGet = {
        text: "SELECT images, video_url FROM destination WHERE id = $1",
        values: [id],
      };

      const { rows: destinationRows } = await sql.query(queryGet);

      if (destinationRows.length === 0) {
        return errorResponse(response, "Destination not found");
      }

      const imagesURLS = destinationRows[0].images ?? [];
      const videoURL = destinationRows[0].video_url ?? "";

      const allURLS = [...imagesURLS];

      if (videoURL) {
        allURLS.push(videoURL);
      }

      const env = process.env.NODE_ENV || "development";
      const allPublicIDs = allURLS.map(
        (url) => `${env}/${getCloudinaryID(url)}`
      );
      if (allPublicIDs.length > 0)
        await cloudinary.api.delete_resources(allPublicIDs);

      const queryDelete = {
        text: "DELETE FROM destination WHERE id = $1 RETURNING *;",
        values: [id],
      };

      await sql.query(queryDelete);

      return successResponse(response, "DELETE", "destination");
    } catch (error) {
      return errorResponse(response, error);
    }
  } else {
    return response
      .status(405)
      .json({ status: "error", message: "Method not allowed" });
  }
};

export default withAuth(handler);
