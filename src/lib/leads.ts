import "server-only";

import { readDataJson, writeDataJson } from "./fs-data";
import type { Lead } from "./leads-shared";

interface LeadsFile {
  leads: Lead[];
}

async function readLeadsFile(): Promise<LeadsFile> {
  try {
    return await readDataJson<LeadsFile>("leads.json");
  } catch {
    return { leads: [] };
  }
}

export async function getLeads(): Promise<Lead[]> {
  return (await readLeadsFile()).leads.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt">
): Promise<Lead> {
  const data = await readLeadsFile();
  const record: Lead = {
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  data.leads.push(record);
  await writeDataJson(data, "leads.json");
  return record;
}

export async function deleteLead(id: string) {
  const data = await readLeadsFile();
  data.leads = data.leads.filter((lead) => lead.id !== id);
  await writeDataJson(data, "leads.json");
}
