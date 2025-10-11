import { redirect } from "next/navigation";
import { syncClerkUser } from "../action";

export default async function DashboardPage() {
    try {
        const role = await syncClerkUser();

        if (!role) {
            // cas sans rôle => on envoie sur une page de maintenance
            return redirect("/dashboard/error");
        }

        if (role === "ADMIN") return redirect("/dashboard/admin");
        if (role === "COMPTABLE") return redirect("/dashboard/comptable");

        // cas par défaut
        return redirect("/dashboard/error");
    } catch (err: any) {
        // ✅ On ignore la fausse erreur NEXT_REDIRECT
        if (err?.digest?.startsWith("NEXT_REDIRECT")) {
            // ne pas log, c’est normal
            throw err; // Next.js doit la propager pour rediriger
        }

        console.error("⚠️ Erreur réelle DashboardPage:", err);
        // Rediriger vers ta page de maintenance
        redirect("/maintenance");
    }
}
