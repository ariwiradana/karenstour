import { errorResponse, successResponse } from "@/utils/response";
import { put } from "@vercel/blob";
import type { NextApiResponse, NextApiRequest, PageConfig } from "next";

const allowedFileTypes: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};
const maxFileSizeImage = 3 * 1024 * 1024;
const maxFileSizeVideo = 30 * 1024 * 1024;

function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
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
    const blob = await put(`${filepath}/${filename}.${filetype.split("/")[1]}`, request, {
      access: "public",
      multipart: true,
    });

    return successResponse(response, "POST", "upload file", blob);
  } catch (error) {
    return errorResponse(response, error);
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
