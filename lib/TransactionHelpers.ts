import prisma from "@/lib/prisma";
import { FormDataType, TransactionWithCategory } from "../type";
import { getCurrentUser } from "@/app/action";// fonction pour récupérer user via clerkId
import { syncJournalFinancierNode } from "./journalFinancierHelpers";

 

// ✅ Create Transaction Node
export async function createTransactionNode(
  formData: FormDataType,
  clerkId: string
) {
  const { name, description, amount, type, imageUrl, categoryId } = formData;
  if (!name || amount === undefined || !categoryId || !type)
    throw new Error("Nom, montant et catégorie requis");
  if (Number(amount) < 0) throw new Error("Montant doit être positif");

  const user = await getCurrentUser(clerkId);
  if (!user) throw new Error("Utilisateur introuvable");

  const transaction = await prisma.transaction.create({
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

  // 🔄 Synchronisation du journal financier après transaction
  await syncJournalFinancierNode();

  return transaction;
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
export async function updateTransactionNode(formData: FormDataType, clerkId: string) {
  try {
    const { id, name, description, amount,  imageUrl } = formData;
    if (!id || !amount || !description  || !imageUrl) {
      throw new Error(
        "L'id, le nom, le prix et la description sont requis pour la mise a jour du produit."
      );
    }

    const user = await getCurrentUser(clerkId);
    if (!user) {
      throw new Error("Aucune Associaton trouvé avec cet email");
    }

    await prisma.transaction.update({
      where: {
        id: id,
        createdById: user.id,
      },
      data: {
        name,
        description,
        amount: Number(amount),
        imageUrl: imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

// ✅ Read TransactionByIdNode
export async function readTransactionByIdNode(transactionId: string, clerkId: string) {
  try {
    if (!clerkId) {
      throw new Error("Votre Id est requis !");
    }

    const user = await getCurrentUser(clerkId);
    if (!user) {
      throw new Error("Aucun Id trouvé avec cet email");
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
        createdById: user.id,
      },
      include: {
        category: true,
      },
    });
    if (!transaction) {
      return null;
    }

    return {
      ...transaction,
      categoryName: transaction.category?.name,
    };
  } catch (error) {
    console.error(error);
  }
}


// ✅ Delete Transaction Node
export async function deleteTransactionNode(transactionId: string, clerkId: string) {
    const user = await getCurrentUser(clerkId);
    if (!user) throw new Error("Utilisateur introuvable");

    return await prisma.transaction.deleteMany({
        where: { id: transactionId, createdById: user.id },
    });
}
