import { Transaction as PrismaTransaction, Role} from "@prisma/client";

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
export interface UserDataType {
  id: string;
  nom: string; 
  email: string;
  role?: Role | ""
}

// 📂 lib/types.ts

export type PeriodeType = "jour" | "semaine" | "mois" | "annee";

export type ChartDataPoint = {
  date: string;
  recettes: number;
  depenses: number;
};

export type DashboardStats = {
  periode: PeriodeType;
  totalRecettes: number;
  totalDepenses: number;
  resultatNet: number;
  statut: "BENEFICIAIRE" | "NEUTRE" | "DEFICITAIRE";
  chartData: ChartDataPoint[];
};

export type DashboardSummary = {
  totalTransactionsCount: number;
  employeesCount: number;
  categoriesCount: number;
};

export type DashboardData = DashboardStats & DashboardSummary;
