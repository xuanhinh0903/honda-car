import fs from "fs";
import os from "os";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const IS_SERVERLESS = process.env.VERCEL === "1";
const WRITABLE_DIR = IS_SERVERLESS
  ? path.join(os.tmpdir(), "honda-car-data")
  : DATA_DIR;
const PUBLIC_DIR = path.join(process.cwd(), "public");

function assertInside(base: string, target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error("Invalid path");
  }
  return resolved;
}

function getWritablePath(...segments: string[]) {
  return assertInside(WRITABLE_DIR, path.join(WRITABLE_DIR, ...segments));
}

function getBundledPath(...segments: string[]) {
  return assertInside(DATA_DIR, path.join(DATA_DIR, ...segments));
}

export function getDataFilePath(...segments: string[]) {
  return getWritablePath(...segments);
}

export function getPublicFilePath(...segments: string[]) {
  return assertInside(PUBLIC_DIR, path.join(PUBLIC_DIR, ...segments));
}

export function readDataJson<T>(...segments: string[]): T {
  const writablePath = getWritablePath(...segments);
  const filePath = fs.existsSync(writablePath)
    ? writablePath
    : getBundledPath(...segments);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

export function writeDataJson(data: unknown, ...segments: string[]) {
  const filePath = getWritablePath(...segments);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf-8"
  );
}

export function deleteDataFile(...segments: string[]) {
  const filePath = getWritablePath(...segments);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function listDataJsonFiles(...dirSegments: string[]): string[] {
  const names = new Set<string>();
  for (const dirPath of [
    getWritablePath(...dirSegments),
    getBundledPath(...dirSegments),
  ]) {
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (file.endsWith(".json") && file !== "index.json") {
        names.add(file.replace(/\.json$/, ""));
      }
    }
  }
  return [...names];
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
