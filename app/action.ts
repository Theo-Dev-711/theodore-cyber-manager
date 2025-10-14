"use server";

import { createCategoryNode, deleteCategoryNode, getCategoriesNode, getCategoryByIdNode, updateCategoryNode } from "@/lib/categoryHelpers";
import {
  getCurrentUserNode,
  getUserRoleNode,
  syncClerkUserNode,
  verifyUserClerkIdNode,
} from "@/lib/prismaHelpers";
import {
  createTransactionNode,
  deleteTransactionNode,
  readTransactionsNode,
  readTransactionByIdNode,
  updateTransactionNode,
} from "@/lib/TransactionHelpers";
import { FormDataType } from "@/type";

export async function getUserRole() {
  try {
    return await getUserRoleNode();
  } catch (err: any) {
    console.error("Erreur getUserRole:", err);
    return null;
  }
}

export async function syncClerkUser() {
  try {
    return await syncClerkUserNode();
  } catch (err: any) {
    console.error("Erreur syncClerkUser:", err);
    return null;
  }
}

export async function verifyUserClerkId() {
  try {
    return await verifyUserClerkIdNode();
  } catch (error: any) {
    console.error("⚠️ Erreur verifyUserClerkId:", error.message);
    return null; // ou tu peux gérer la redirection dans le middleware
  }
}

 export async function getCurrentUser(clerkId: string){
  try {
    return await getCurrentUserNode(clerkId)
  } catch (error) {
    console.error(error)
  }
 }

 export async function createCategory(name: string, description?: string) {
   try {
     return await createCategoryNode(name, description);
   } catch (error) {
     console.error("Erreur createCategory:", error);
     throw error;
   }
 }

 export async function getCategories() {
   try {
     return await getCategoriesNode();
   } catch (error) {
     console.error("Erreur getCategories:", error);
     throw error;
   }
 }

 export async function getCategoryById(id: string) {
   try {
     return await getCategoryByIdNode(id);
   } catch (error) {
     console.error("Erreur getCategoryById:", error);
     throw error;
   }
 }

 export async function updateCategory(
   id: string,
   name?: string,
   description?: string
 ) {
   try {
     return await updateCategoryNode(id, name, description);
   } catch (error) {
     console.error("Erreur updateCategory:", error);
     throw error;
   }
 }

 export async function deleteCategory(id: string) {
   try {
     return await deleteCategoryNode(id);
   } catch (error) {
     console.error("Erreur deleteCategory:", error);
     throw error;
   }
 }

 // ✅ Create Transaction Action
export async function createTransaction(formData: FormDataType, clerkId: string) {
  try {
    return await createTransactionNode(formData, clerkId);
  } catch (error) {
    console.error("Erreur createTransaction:", error);
    throw error;
  }
}

// ✅ Get Transactions Action
export async function getTransactions(clerkId: string) {
  try {
    return await readTransactionsNode(clerkId);
  } catch (error) {
    console.error("Erreur getTransactions:", error);
    throw error;
  }
}

// ✅ Read Transaction Action
export async function readTransactionById(transactionId: string, clerkId: string) {
  try {
    return await readTransactionByIdNode(transactionId, clerkId);
  } catch (error) {
    console.error("Erreur updateTransaction:", error);
    throw error;
  }
}


export async function updateTransaction(formData: FormDataType, clerkId: string) {
  try {
    return await updateTransactionNode(formData, clerkId);
  } catch (error) {
    console.error("Erreur updateTransaction:", error);
    throw error;
  }
}

// ✅ Delete Transaction Action
export async function deleteTransaction(transactionId: string, clerkId: string) {
  try {
    return await deleteTransactionNode(transactionId, clerkId);
  } catch (error) {
    console.error("Erreur deleteTransaction:", error);
    throw error;
  }
}