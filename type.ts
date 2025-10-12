
import { Transaction as PrismaTransaction } from "@prisma/client";

export interface TransactionWithCategory extends PrismaTransaction {
  categoryName: string;
}

export interface FormDataType {
  id?: string;
  name: string;
  amount: number;
  description: string;
  type: string;
  imageUrl?: string;
  categoryId?: string;
  categoryName?: string;
}
