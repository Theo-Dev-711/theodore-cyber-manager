// type.ts
import { Transaction as PrismaTransaction, Category } from "@prisma/client";

/**
 * Représente une transaction avec les infos de la catégorie et imageUrl
 */
export interface TransactionWithCategory extends PrismaTransaction {
  categoryName: string; // champ dérivé pour affichage
}

/**
 * Formulaire de création ou mise à jour de transaction
 */
export interface FormDataType {
  id?: string;
  name: string;
  amount: number;
  description?: string;
  type: string // Enum TypeTransaction
  imageUrl?: string | null;
  categoryId: string;
  categoryName?: string;
}
