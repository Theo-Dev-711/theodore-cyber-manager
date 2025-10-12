// app/maintenance/page.tsx
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";

export const runtime = "nodejs";

export default async function MaintenancePage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // Vérifie encore que le user n'existe pas en BD
    const existing = await prisma.users.findFirst({
        where: { clerkId: user.id },
    });

    if (existing) {
        // 🔒 Si l'utilisateur est déjà dans la base, il ne doit pas être ici
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">

            <h1 className="text-4xl max-sm:text-xl font-bold text-red-600">
                <span>🚧</span> <br/>
                 Service momentanément indisponible
            </h1>
            <p className="mt-4 text-gray-700 max-w-md text-center">Vous devriez d'abord être employé de l'entreprise.</p>
            <p className="text-xs text-gray-500 underline mt-3">Veuillez Contacter l'administrateur @711</p>
        </div>
    );
}
