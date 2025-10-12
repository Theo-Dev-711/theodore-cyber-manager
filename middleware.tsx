// 🔧 Indique à Next.js d’exécuter ce middleware côté serveur Node.js
export const runtime = "nodejs";

import { clerkMiddleware } from "@clerk/nextjs/server";  // Middleware de Clerk pour gérer l’authentification
import { NextResponse } from "next/server";              // Utilisé pour rediriger ou continuer la requête
import prisma from "@/lib/prisma";                       // Instance Prisma pour interagir avec la base de données
import { syncClerkUser } from "./app/action";            // Fonction personnalisée qui synchronise un utilisateur Clerk avec la base de données

// 📍 Fonction utilitaire pour identifier les routes publiques (sign-in et sign-up)
const isPublicRoute = (path: string) =>
    ["/sign-in", "/sign-up"].some((route) => path.startsWith(route));


// 🧩 Middleware principal
export default clerkMiddleware(async (auth, req) => {
    // 🔐 Récupère l’ID de l’utilisateur authentifié (si connecté)
    const { userId } = await auth();
    const url = new URL(req.url);
    const path = url.pathname;

    // ==========================================
    // ✅ 1️⃣ ROUTES PUBLIQUES
    // ==========================================
    // Ces routes ne nécessitent pas d’authentification
    if (isPublicRoute(path)) {
        // Si l’utilisateur est déjà connecté, on le redirige vers son tableau de bord
        if (userId) return NextResponse.redirect(new URL("/dashboard", req.url));

        // Sinon, on le laisse accéder normalement (connexion / inscription)
        return NextResponse.next();
    }

    // ==========================================
    // ✅ 2️⃣ PAGE /maintenance
    // ==========================================
    // Accès spécial réservé UNIQUEMENT aux utilisateurs non enregistrés en base
    if (path.startsWith("/maintenance")) {
        // Si l’utilisateur n’est pas connecté → on le redirige vers la page de connexion
        if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

        // On vérifie s’il existe déjà dans la base
        const existing = await prisma.users.findFirst({ where: { clerkId: userId } });

        // Si l’utilisateur existe → il n’a rien à faire ici, redirection vers /dashboard
        if (existing) return NextResponse.redirect(new URL("/dashboard", req.url));

        // Sinon, il peut rester sur la page maintenance (ex: compte en attente)
        return NextResponse.next();
    }

    // ==========================================
    // ✅ 3️⃣ ROUTES PROTÉGÉES
    // ==========================================
    // Toute autre route nécessite une authentification
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

    // ==========================================
    // ✅ 4️⃣ VÉRIFICATION DE L’UTILISATEUR EN BASE
    // ==========================================
    let existing = null;
    try {
        // On cherche le user dans la base selon son ID Clerk
        existing = await prisma.users.findFirst({ where: { clerkId: userId } });
    } catch (err: any) {
        // En cas d’erreur de connexion ou de requête DB → redirection maintenance
        console.error("Erreur DB:", err.message);
        return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    // ==========================================
    // 🔄 5️⃣ SYNCHRONISATION SI L’UTILISATEUR N’EXISTE PAS
    // ==========================================
    if (!existing) {
        try {
            // Essaie de créer l’utilisateur manquant via Clerk
            await syncClerkUser();
        } catch (e: any) {
            console.error("Sync échoué:", e.message);
            return NextResponse.redirect(new URL("/maintenance", req.url));
        }

        // Double vérification après tentative de sync
        existing = await prisma.users.findFirst({ where: { clerkId: userId } });
        if (!existing) {
            console.warn("Utilisateur toujours absent après sync");
            return NextResponse.redirect(new URL("/maintenance", req.url));
        }
    }

    // ==========================================
    // 🔐 6️⃣ CONTRÔLE D’ACCÈS PAR RÔLE
    // ==========================================
    const role = existing.role;

    // Si un utilisateur non-admin tente d’accéder à une route admin
    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
        console.warn("🚫 Accès refusé (non-admin):", role);
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si un utilisateur non-comptable tente d’accéder à une route comptable
    if (path.startsWith("/dashboard/comptable") && role !== "COMPTABLE") {
        console.warn("🚫 Accès refusé (non-comptable):", role);
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ==========================================
    // ✅ 7️⃣ TOUT EST OK — on laisse la requête continuer
    // ==========================================
    return NextResponse.next();
});


// ==========================================
// ⚙️ CONFIGURATION DU MIDDLEWARE
// ==========================================
// Ce matcher définit les chemins où le middleware doit s’exécuter.
// On exclut les fichiers statiques (_next, .css, .js, images, etc.)
export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)", // Inclut les routes API et trpc
    ],
};
