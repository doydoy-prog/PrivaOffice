"use client";

// localStorage-backed client store. This is an interim layer that mirrors the
// prototype's behavior so the UI can be built and validated before the Prisma
// layer is wired up. The shape intentionally mirrors prisma/schema.prisma.

import { ClientOrganization, OrganizationType, createEmptyDataAsset } from "./types";

const STORAGE_KEY = "databee:state:v1";

interface Store {
  clients: Record<string, ClientOrganization>;
  activeClientId: string | null;
}

function emptyStore(): Store {
  return { clients: {}, activeClientId: null };
}

export function loadStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Store;
    return { clients: parsed.clients ?? {}, activeClientId: parsed.activeClientId ?? null };
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: Store): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function createClient(name: string, type: OrganizationType): ClientOrganization {
  const store = loadStore();
  const id = `c_${Date.now()}`;
  const org: ClientOrganization = {
    id,
    name,
    type,
    createdAt: new Date().toISOString(),
    dataAsset: createEmptyDataAsset(),
    tasks: {},
    dpoAssessment: {},
  };
  store.clients[id] = org;
  store.activeClientId = id;
  saveStore(store);
  return org;
}

export function deleteClient(id: string): void {
  const store = loadStore();
  delete store.clients[id];
  if (store.activeClientId === id) store.activeClientId = null;
  saveStore(store);
}

export function setActiveClient(id: string | null): void {
  const store = loadStore();
  store.activeClientId = id;
  saveStore(store);
}

export function listClients(): ClientOrganization[] {
  return Object.values(loadStore().clients).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}
