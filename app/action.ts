"use server";

import { getUserRoleNode, syncClerkUserNode } from "@/lib/prismaHelpers";

export async function getUserRole() {
  try {
    return await getUserRoleNode();
  } catch (err: any) {
    console.error("Erreur getUserRole:", err);
    return null;
  }
}

export async function syncClerkUser() {
  try {
    return await syncClerkUserNode();
  } catch (err: any) {
    console.error("Erreur syncClerkUser:", err);
    return null;
  }
}
