// type.ts
import { Transaction as PrismaTransaction, Category } from "@prisma/client";

/**
 * Représente une transaction avec les infos de la catégorie et imageUrl
 */

export interface TransactionWithCategory {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  type: string;
  imageUrl: string ;
  categoryId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  category?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
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
  imageUrl: string ;
  categoryId: string;
  categoryName?: string;
}
