import { errorResponse } from "@/utils/response";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";
import getRawBody from "raw-body";
import { promises as fs } from "fs";
import path from "path";
import { withAuth } from "@/lib/withAuth";

const allowedFileTypes: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};
const maxFileSizeImage = 3 * 1024 * 1024;
const maxFileSizeVideo = 30 * 1024 * 1024;

function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { filename, filepath, filetype, filesize, category } = request.query;

  const maxFileSize =
    category === "video" ? maxFileSizeVideo : maxFileSizeImage;

  if (Number(filesize) > maxFileSize) {
    return errorResponse(response, {
      message: `File ${category} size exceeds the ${bytesToMB(
        maxFileSize
      )} MB limit. Please upload a smaller file.`,
    });
  }

  if (typeof category !== "string" || !allowedFileTypes[category]) {
    return errorResponse(response, {
      message: "Invalid file category. Please specify 'image' or 'video'.",
    });
  }

  if (
    typeof filetype !== "string" ||
    !allowedFileTypes[category].includes(filetype)
  ) {
    return errorResponse(response, {
      message: `Invalid file type for ${category}. Allowed types: ${allowedFileTypes[
        category
      ].join(", ")}.`,
    });
  }

  try {
    const rawBody = await getRawBody(request);
    const fullfilename = `${filepath}/${filename}.${filetype.split("/")[1]}`;
    const url = path.join(process.cwd(), "public/uploads", fullfilename);
    await fs.mkdir(path.dirname(url), { recursive: true });
    await fs.writeFile(url, rawBody);

    return response.status(200).json({
      success: true,
      data: { url: `/uploads/${fullfilename}` },
    });
  } catch (error) {
    return errorResponse(response, error);
  }
};

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default withAuth(handler);
