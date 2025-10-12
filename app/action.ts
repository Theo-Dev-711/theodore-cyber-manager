"use server";

import { createCategoryNode, deleteCategoryNode, getCategoriesNode, getCategoryByIdNode, updateCategoryNode } from "@/lib/categoryHelpers";
import {
  getCurrentUserNode,
  getUserRoleNode,
  syncClerkUserNode,
  verifyUserClerkIdNode,
} from "@/lib/prismaHelpers";

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