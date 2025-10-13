import prisma from "@/lib/prisma";
import { FormDataType, TransactionWithCategory } from "../type";
import { getCurrentUser } from "@/app/action";// fonction pour récupérer user via clerkId
 

// ✅ Create Transaction Node
export async function createTransactionNode(
  formData: FormDataType,
  clerkId: string
) {
  try {
    const { name, description, amount, type, imageUrl, categoryId } = formData;

    if (!name || amount === undefined || !categoryId || !type) {
      throw new Error("Nom, montant et catégorie requis");
    }

    if (amount < 0) {
      throw new Error("Montant doit être positif");
    }

    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable");

    // Forcer TypeScript à accepter string

    const transaction = await prisma.transaction.create({
      data: {
        name,
        description: description || "",
        amount: Number(amount),
        type,
        imageUrl: imageUrl,
        categoryId,
        createdById: user.id,
      },
    });

    return transaction;
  } catch (error) {
    console.error("Erreur createTransactionNode:", error);
    throw error;
  }
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
return transactions.map((tx) => ({
  ...tx,
  categoryName: tx.category?.name || "",
}));

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
