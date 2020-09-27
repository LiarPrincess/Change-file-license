import { promises as fs } from "fs";

let license: string | undefined = undefined;
let oldLicense: string | undefined = undefined;

const getLicense = async () => license || (license = await fs.readFile("./license.txt", "utf8"));
const getOldLicense = async () => oldLicense || (oldLicense = await fs.readFile("./old-license.txt", "utf8"));

export async function addLicense(filePath: string) {
  const license = await getLicense();
  const content = await fs.readFile(filePath, "utf8");

  if (!content.startsWith(license)) {
    const newContent = license + content;
    await fs.writeFile(filePath, newContent, "utf8");
  } else {
    console.log(`Already has proper license: '${filePath}'`);
  }
}

export async function removeLicense(filePath: string) {
  const oldLicense = await getOldLicense();
  const content = await fs.readFile(filePath, "utf8");

  if (content.startsWith(oldLicense)) {
    const newContent = content.substring(oldLicense.length);
    await fs.writeFile(filePath, newContent, "utf8");
  } else {
    console.log(`Has different license: '${filePath}'`);
  }
}
