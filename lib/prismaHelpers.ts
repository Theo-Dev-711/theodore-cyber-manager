// lib/prismaHelpers.ts
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";


export async function syncClerkUserNode() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Non authentifié");

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Utilisateur sans email");

  const existing = await prisma.users.findUnique({ where: { email } });

  if (existing && !existing.clerkId) {
    await prisma.users.update({
      where: { id: existing.id },
      data: { clerkId: clerkUser.id },
    });
  }

  if (existing) return existing.role;


//   const newUser = await prisma.users.create({
//     data: {
//       nom: clerkUser.firstName || "Utilisateur",
//       email,
//       role: "COMPTABLE",
//       clerkId: clerkUser.id,
//     },
//   });

//   return newUser.role;
}

export async function getUserRoleNode() {
  const user = await currentUser();
  if (!user) return null;

  const found = await prisma.users.findFirst({
    where: { clerkId: user.id },
    select: { role: true },
  });

  return found?.role || null;
}



export async function verifyUserClerkIdNode() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Utilisateur non authentifié");

  const  email  = clerkUser.primaryEmailAddress?.emailAddress || {};
  if (!email) throw new Error("Utilisateur sans email");

  const existing = await prisma.users.findFirst({
    where: { clerkId: clerkUser.id }
  });

  if (!existing) throw new Error("Utilisateur introuvable ou clerkId manquant");

  return existing;
}


export async function getCurrentUserNode(clerkId: string) {
  if (!clerkId) return;

  try {
    // Cherche l'utilisateur correspondant au clerkId
    const existingUser = await prisma.users.findFirst({
      where: { clerkId },
    });

    return existingUser; // Retourne l'utilisateur trouvé ou undefined
  } catch (error) {
    console.error("Erreur getCurrentUserNode:", error);
  }
}

