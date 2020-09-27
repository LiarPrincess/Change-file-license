import { join } from "path";
import { promises as fs } from "fs";
import { addLicense, removeLicense } from "./license";

(async () => {
  try {
    const dir = "/Users/michal/Documents/Xcode/Violet/Sources";
    const extension = ".swift";

    const files = await findFiles(dir, extension);
    for (const filePath of files) {
      // await addLicense(filePath);
      await removeLicense(filePath);
    }
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();

async function findFiles(dir: string, extension: string): Promise<string[]> {
  const result: string[] = [];
  const dirEntries = await fs.readdir(dir);

  for (const entry of dirEntries) {
    const entryPath = join(dir, entry);
    const stat = await fs.stat(entryPath);

    if (stat.isFile() && entry.endsWith(extension)) {
      result.push(entryPath);
    } else if (stat.isDirectory() && entry !== "Build") {
      const childFiles = await findFiles(entryPath, extension);
      result.push(...childFiles);
    }
  }

  return result;
}
