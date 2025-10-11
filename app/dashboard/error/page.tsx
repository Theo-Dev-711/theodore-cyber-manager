"use server";

import { currentUser } from "@clerk/nextjs/server";
import { BadgeMinus, Check } from "lucide-react";

export default async function ErrorPage() {
    // Récupération de l'utilisateur connecté
    const user = await currentUser();

    if (!user) {
        return (
            <div>
                Vous n'êtes pas connecté.
            </div>
        );
    }

    // Infos que tu peux afficher
    const fullName = user.fullName || "Utilisateur";
    const email = user.primaryEmailAddress?.emailAddress || "Email inconnu";

    return (
        <div className="flex flex-col items-center text-center gap-4 mt-20">
            <h1 className="text-4xl font-bold">Mes félicitations, {fullName} !</h1>
            <p className="text-xl text-gray-600">Vous etes connecte mais on ne vous reconnais pas !.</p>
            <p className="text-xs text-gray-600">veuillez contacter un admin pour une attribution de role .</p>
            <p className="text-lg">Email : {email}</p>
            
            <BadgeMinus className="w-20 h-20 text-red-600"/>
        </div>
    );
}

