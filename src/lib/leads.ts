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
  lead: Omit<Lead, "id" | "createdAt" | "notification" | "telegram">
): Lead {
  const data = readLeadsFile();
  const record: Lead = {
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    notification: null,
    telegram: null,
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

export function updateLeadNotification(id: string, status: Lead["notification"]) {
  const data = readLeadsFile();
  const lead = data.leads.find((item) => item.id === id);
  if (lead) {
    lead.notification = status;
    writeLeadsFile(data);
  }
}

export function updateLeadTelegram(id: string, status: Lead["telegram"]) {
  const data = readLeadsFile();
  const lead = data.leads.find((item) => item.id === id);
  if (lead) {
    lead.telegram = status;
    writeLeadsFile(data);
  }
}
