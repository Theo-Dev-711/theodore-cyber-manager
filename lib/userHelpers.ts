import prisma from "@/lib/prisma";
import { UserDataType } from "../type";

export async function createUserNode(formData: UserDataType) {
  try {
    const { nom, email, role } = formData;

    if (!nom || !role || !email) {
      throw new Error(
        "Le nom, le rôle et l'email de l'utilisateur sont requis pour l'inscription."
      );
    }
    const user = await prisma.users.create({
      data: {
        nom, // correspond au champ Prisma
        email,
        role,
      },
    });
    return user;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    throw error; // pour que le frontend reçoive l'erreur
  }
}

export async function getAllUsersNode() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        createdAt: true,
        clerkId: true,
      },
      orderBy: {
        createdAt: "desc", // optionnel : pour trier par date de création
      },
    });

    return users; // retourne le tableau d'utilisateurs
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error; // pour que le frontend puisse gérer l'erreur
  }
}

export async function deleteUserNode(id: string) {
  try {
    if (!id) {
      throw new Error("L'ID est requis pour la suppression.");
    }

    const deletedUser = await prisma.users.delete({
      where: {
        id, // correspond au champ dans ton modèle Prisma
      },
    });

    return deletedUser; // utile si tu veux afficher un message de confirmation
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error; // pour que le frontend gère l’erreur
  }
}

export async function updateUserNode(formData: UserDataType) {
  try {
    const { id, nom, role, email } = formData;
    if (!id || !nom || !role || !email) {
      throw new Error(
        "L'id, le nom et l'email sont requis pour la mise a jour de cet utilisateur."
      );
    }

    await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        nom,
        email,
        role,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
