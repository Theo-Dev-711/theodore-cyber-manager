// 📂 components/DashboardChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: { date: string; recettes: number; depenses: number }[];
}

export default function DashboardChart({ data }: Props) {
    return (
        <div className="mt-6 card p-4 shadow bg-base-100">
            <h2 className="text-lg font-bold mb-4">Évolution Recette vs Dépense</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="recettes" stroke="#16a34a" strokeWidth={2} />
                    <Line type="monotone" dataKey="depenses" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
