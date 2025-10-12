import prisma from "@/lib/prisma";

export async function createCategoryNode(name: string, description?: string) {
  if (!name) {
    throw new Error("Le nom de la catégorie est obligatoire.");
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        description: description || "",
      },
    });

    return newCategory; // Bonne pratique : retourner la catégorie créée
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    throw error;
  }
}

export async function getCategoriesNode() {
  try {
    return await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    throw error;
  }
}

export async function getCategoryByIdNode(id: string) {
  if (!id) throw new Error("ID manquant");
  try {
    return await prisma.category.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Erreur récupération catégorie par ID:", error);
    throw error;
  }
}

export async function updateCategoryNode(
  id: string,
  name?: string,
  description?: string
) {
  if (!id) throw new Error("ID manquant");

  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return updatedCategory;
  } catch (error) {
    console.error("Erreur mise à jour catégorie:", error);
    throw error;
  }
}

export async function deleteCategoryNode(id: string) {
  if (!id) throw new Error("ID manquant");

  try {
    await prisma.category.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur suppression catégorie:", error);
    throw error;
  }
}

