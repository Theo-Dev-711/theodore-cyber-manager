// 📂 app/dashboard/page.tsx
"use client";

import { getDashboardData } from "@/app/action";
import DashboardHeader from "@/app/components/DashboardHeader";
import DashboardPeriodStats from "@/app/components/DashboardPeriodStats";
import DashboardStats from "@/app/components/DashboardStats";
import { BarChart3, FolderOpen, Users } from "lucide-react";
import React, { useEffect, useState } from "react";


export default function DashboardPage() {
    const [periode, setPeriode] = useState<"jour" | "semaine" | "mois" | "annee">("jour");
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getDashboardData(periode).then((res) => {
            setDashboardData(res);
            setLoading(false);
        });
    }, [periode]);

    if (loading) 
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
                <p className="text-blue-500 font-semibold text-lg animate-pulse">
                    Chargement des données du tableau de bord...
                </p>
            </div>
        );

;

    return (
        <div className="p-4">
            <DashboardHeader title="Tableau de bord" />

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <DashboardStats icon={<BarChart3 className="w-6 h-6 text-primary" />} label="Transactions totales" value={dashboardData.totalTransactionsCount} />
                <DashboardStats icon={<Users className="w-6 h-6 text-primary" />} label="Employés" value={dashboardData.employeesCount} />
                <DashboardStats icon={<FolderOpen className="w-6 h-6 text-primary" />} label="Catégories" value={dashboardData.categoriesCount} />

            </div>

            {/* Sélecteur de période */}
            <div className="mt-6 flex justify-end">
                <select
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value as any)}
                    className="select select-bordered select-sm"
                >
                    <option value="jour">Jour</option>
                    <option value="semaine">Semaine</option>
                    <option value="mois">Mois</option>
                    <option value="annee">Année</option>
                </select>
            </div>

            {/* Statistiques financières + Graphe */}
            <DashboardPeriodStats
                totalRecettes={dashboardData?.totalRecettes}
                totalDepenses={dashboardData?.totalDepenses}
                resultatNet={dashboardData?.resultatNet}
                statut={dashboardData?.statut}
                chartData={dashboardData?.chartData}
            />
        </div>
    );
}
