import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function assertInside(base: string, target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error("Invalid path");
  }
  return resolved;
}

export function getDataFilePath(...segments: string[]) {
  return assertInside(DATA_DIR, path.join(DATA_DIR, ...segments));
}

export function getPublicFilePath(...segments: string[]) {
  return assertInside(PUBLIC_DIR, path.join(PUBLIC_DIR, ...segments));
}

export function readDataJson<T>(...segments: string[]): T {
  const filePath = getDataFilePath(...segments);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

export function writeDataJson(data: unknown, ...segments: string[]) {
  const filePath = getDataFilePath(...segments);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf-8"
  );
}

export function deleteDataFile(...segments: string[]) {
  const filePath = getDataFilePath(...segments);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function listDataJsonFiles(...dirSegments: string[]): string[] {
  const dirPath = getDataFilePath(...dirSegments);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .map((file) => file.replace(/\.json$/, ""));
}

export function writePublicFile(
  buffer: Buffer,
  ...segments: string[]
): string {
  const filePath = getPublicFilePath(...segments);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return `/${path.posix.join(...segments)}`;
}

export function deletePublicFile(...segments: string[]) {
  const filePath = getPublicFilePath(...segments);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
