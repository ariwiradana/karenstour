import { errorResponse } from "@/utils/response";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";
import { v2 as cloudinary } from "cloudinary";
import multiparty from "multiparty";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const form = new multiparty.Form();
    const parsedForm = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(request, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );
    const { files } = parsedForm;
    const file = files.file[0];

    const result = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1920,
        crop: "scale",
      },
    });
    return response.status(200).json({ success: true, data: result });
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
