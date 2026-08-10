import "server-only";

import fs from "fs";
import { getDataFilePath, writeDataJson } from "./fs-data";
import type { Lead } from "./leads-shared";

interface LeadsFile {
  leads: Lead[];
}

function readLeadsFile(): LeadsFile {
  try {
    const filePath = getDataFilePath("leads.json");
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as LeadsFile;
  } catch {
    return { leads: [] };
  }
}

function writeLeadsFile(data: LeadsFile) {
  writeDataJson(data, "leads.json");
}

export function getLeads(): Lead[] {
  return readLeadsFile().leads.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function addLead(
  lead: Omit<Lead, "id" | "createdAt">
): Lead {
  const data = readLeadsFile();
  const record: Lead = {
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  data.leads.push(record);
  writeLeadsFile(data);
  return record;
}

export function deleteLead(id: string) {
  const data = readLeadsFile();
  data.leads = data.leads.filter((lead) => lead.id !== id);
  writeLeadsFile(data);
}
