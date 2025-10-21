// 📂 components/DashboardPeriodStats.tsx
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, DollarSign, PieChart, TrendingDown, TrendingUp } from "lucide-react"

interface Props {
    totalRecettes: number;
    totalDepenses: number;
    resultatNet: number;
    statut: string;
    chartData: { date: string; recettes: number; depenses: number }[];
}

export default function DashboardPeriodStats({
    totalRecettes,
    totalDepenses,
    resultatNet,
    statut,
    chartData,
}: Props) {
    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card shadow-md border border-blue-600 h-[7rem] bg-blue-100 p-4 flex flex-row items-center justify-between">
                    <div>
                         <div className="font-semibold text-lg">Recettes</div>
                        <TrendingUp className="text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{totalRecettes} FCFA</div>
                </div>
                <div className="card shadow-md border border-red-600 h-[7rem] bg-red-100 p-4 flex flex-row items-center justify-between">
                    <div>
                        <div className="font-semibold text-lg">Depenses</div>
                        <TrendingDown className="text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-700">{totalDepenses} FCFA</div>
                </div>
                <div className="card shadow-md border border-green-600 h-[7rem] bg-green-200 p-4 flex flex-row items-center justify-between">
                    <div>
                        <div className="font-semibold text-lg">Resultat Net</div>
                        <DollarSign className="text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">{resultatNet} FCFA</div>
                </div>
            </div>

            {/* 🔹 Graphique Recharts */}
            <div className="card bg-base-100 p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Évolution Recettes vs Dépenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="recettes" stroke="#16a34a" name="Recettes" />
                        <Line type="monotone" dataKey="depenses" stroke="#dc2626" name="Dépenses" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
