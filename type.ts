import { Transaction as PrismaTransaction} from "@prisma/client";

export interface TransactionWithCategory extends PrismaTransaction {
  categoryName: string;
}

export interface FormDataType {
  id?: string;
  name: string; // ✅ Toujours string, jamais null
  amount: number;
  description: string ;
  type: string; // Enum TypeTransaction
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
}
