import prisma from "@/lib/prisma";
import { FormDataType, TransactionWithCategory } from "../type";
import { getCurrentUser } from "@/app/action";// fonction pour récupérer user via clerkId
 

// ✅ Create Transaction Node
export async function createTransactionNode(formData: FormDataType, clerkId: string) {
    const { name, description, amount, type, imageUrl, categoryId } = formData;

    if (!name || amount === undefined || !categoryId) {
        throw new Error("Le nom, le montant et la catégorie sont requis");
    }

    if (amount < 0) throw new Error("Le montant doit être supérieur à 0");

    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable");

    return await prisma.transaction.create({
      data: {
        name,
        description: description || "",
        amount: Number(amount),
        type,
        imageUrl: imageUrl || "",
        categoryId,
        createdById: user.id,
      },
    });
}

// ✅ Read Transactions Node
export async function readTransactionsNode(
  clerkId: string
): Promise<TransactionWithCategory[] | undefined> {
  try {
    if (!clerkId) throw new Error("clerkId est requis !");

    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable avec ce clerkId");

    const transactions = await prisma.transaction.findMany({
      where: { createdById: user.id },
      include: { category: true }, // ✅ on inclut bien la relation Category
      orderBy: { createdAt: "desc" },
    });

    // ✅ on ajoute le champ calculé categoryName
    return transactions.map(
      (tx): TransactionWithCategory => ({
        id: tx.id,
        name: tx.name,
        amount: tx.amount,
        description: tx.description,
        type: tx.type,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        imageUrl: tx.imageUrl, // ✅ requis
        categoryId: tx.categoryId,
        createdById: tx.createdById,
        categoryName: tx.category?.name || "",
        category: tx.category
          ? {
              id: tx.category.id,
              name: tx.category.name,
              description: tx.category.description,
            }
          : null,
      })
    );

  } catch (error) {
    console.error("Erreur readTransactions:", error);
    return undefined;
  }
}

// ✅ Update Transaction Node
export async function updateTransactionNode(transactionId: string, formData: FormDataType, clerkId: string) {
    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable");

    return await prisma.transaction.updateMany({
        where: { id: transactionId, createdById: user.id },
        data: {
            name: formData.name || "",
            description: formData.description || "",
            amount: formData.amount,
            type: formData.type,
            imageUrl: formData.imageUrl || "",
            categoryId: formData.categoryId,
        },
    });
}

// ✅ Delete Transaction Node
export async function deleteTransactionNode(transactionId: string, clerkId: string) {
    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable");

    return await prisma.transaction.deleteMany({
        where: { id: transactionId, createdById: user.id },
    });
}
