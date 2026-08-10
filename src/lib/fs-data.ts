import fs from "fs";
import os from "os";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const IS_SERVERLESS = process.env.VERCEL === "1";
const WRITABLE_DIR = IS_SERVERLESS
  ? path.join(os.tmpdir(), "honda-car-data")
  : DATA_DIR;
const PUBLIC_DIR = path.join(process.cwd(), "public");

const KV_PREFIX = "data:";

function kvEnabled() {
  return Boolean(process.env.KV_REST_API_URL || process.env.KV_URL);
}

function toKey(segments: string[]) {
  return KV_PREFIX + segments.join("/");
}

async function kvGet(key: string): Promise<string | null> {
  const { kv } = await import("@vercel/kv");
  return (await kv.get<string>(key)) ?? null;
}

async function kvSet(key: string, value: string) {
  const { kv } = await import("@vercel/kv");
  await kv.set(key, value);
}

async function kvDel(key: string) {
  const { kv } = await import("@vercel/kv");
  await kv.del(key);
}

async function kvKeys(pattern: string): Promise<string[]> {
  const { kv } = await import("@vercel/kv");
  return kv.keys(pattern);
}

function assertInside(base: string, target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base) + path.sep)) {
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

export async function readDataJson<T>(...segments: string[]): Promise<T> {
  if (kvEnabled()) {
    const raw = await kvGet(toKey(segments));
    if (raw !== null) return JSON.parse(raw) as T;
  }

  const writablePath = getWritablePath(...segments);
  const filePath = fs.existsSync(writablePath)
    ? writablePath
    : getBundledPath(...segments);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

export async function writeDataJson(
  data: unknown,
  ...segments: string[]
): Promise<void> {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  if (kvEnabled()) {
    await kvSet(toKey(segments), content);
  }

  const filePath = getWritablePath(...segments);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

export async function deleteDataFile(...segments: string[]): Promise<void> {
  if (kvEnabled()) {
    await kvDel(toKey(segments));
  }

  const filePath = getWritablePath(...segments);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function listDataJsonFiles(
  ...dirSegments: string[]
): Promise<string[]> {
  const names = new Set<string>();

  if (kvEnabled()) {
    const prefix = `${toKey(dirSegments)}/`;
    for (const key of await kvKeys(`${prefix}*`)) {
      const name = key.slice(prefix.length);
      if (name && name.endsWith(".json") && name !== "index.json") {
        names.add(name.replace(/\.json$/, ""));
      }
    }
  }

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

export function getPublicFilePath(...segments: string[]) {
  return assertInside(PUBLIC_DIR, path.join(PUBLIC_DIR, ...segments));
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
