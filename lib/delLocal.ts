import fs from "fs/promises";
import path from "path";

const delLocal = async (url: string): Promise<void> => {
  try {
    const filePath = path.join(process.cwd(), "public", url);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch {
      console.log(`File does not exist: ${filePath}`);
    }
  } catch (err: unknown) {
    console.log(err);
    throw new Error(`Failed to delete file locally`);
  }
};

export default delLocal;
