// middleware.ts
export const runtime = "nodejs";

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncClerkUser } from "./app/action";

const isPublicRoute = (path: string) =>
    ["/sign-in", "/sign-up"].some((route) => path.startsWith(route));

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const url = new URL(req.url);

    // ✅ ROUTES PUBLIQUES
    if (isPublicRoute(url.pathname)) {
        if (userId) return NextResponse.redirect(new URL("/dashboard", req.url));
        return NextResponse.next();
    }

    // ✅ ROUTE MAINTENANCE (accès restreint)
    if (url.pathname.startsWith("/maintenance")) {
        // Si pas connecté → redirection vers sign-in
        if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

        // Si connecté → on regarde s’il existe en base
        const existing = await prisma.users.findFirst({ where: { clerkId: userId } });

        // S’il existe → pas le droit d’aller sur /maintenance
        if (existing) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Sinon (il n'existe pas) → il peut rester sur /maintenance
        return NextResponse.next();
    }

    // ✅ ROUTES PROTÉGÉES
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));

    // Vérifie l'existence de l'utilisateur
    let existing = null;
    try {
        existing = await prisma.users.findFirst({ where: { clerkId: userId } });
    } catch (err: any) {
        console.error("Erreur DB:", err.message);
        return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    // 🔹 Synchronisation si besoin
    if (!existing) {
        try {
            await syncClerkUser();
        } catch (e: any) {
            console.error("Sync échoué:", e.message);
            return NextResponse.redirect(new URL("/maintenance", req.url));
        }

        // Double vérif : existe maintenant ?
        const stillMissing = await prisma.users.findFirst({ where: { clerkId: userId } });
        if (!stillMissing) {
            console.warn("Utilisateur toujours absent après sync");
            return NextResponse.redirect(new URL("/maintenance", req.url));
        }
    }

    // ✅ Tout est bon
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
