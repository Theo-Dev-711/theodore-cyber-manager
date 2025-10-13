
import { Category, Transaction as PrismaTransaction } from "@prisma/client";

export interface TransactionWithCategory extends PrismaTransaction {
  imageUrl: string  // 🔹 ajoute explicitement
  category?: Category | null; // relation incluse
  categoryName?: string; // champ dérivé
}

export interface FormDataType {
  id?: string;
  name: string;
  amount: number;
  description: string;
  type: string;
  imageUrl?: string | null;
  categoryId?: string;
  categoryName?: string;
}
