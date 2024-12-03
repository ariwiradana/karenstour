import { errorResponse } from "@/utils/response";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm, Fields, Files } from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const parsedForm = await new Promise<{ fields: Fields; files: Files }>(
      (resolve, reject) => {
        const form = new IncomingForm();
        form.parse(request, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const { files } = parsedForm;
    const { file } = files as Files;

    if (file?.length) {
      const result = await cloudinary.uploader.upload(file[0].filepath, {
        transformation: {
          fetch_format: "auto",
          quality: "auto",
        },
      });
      return response.status(200).json({ success: true, data: result });
    }
  } catch (error) {
    return errorResponse(response, error);
  }
};

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
