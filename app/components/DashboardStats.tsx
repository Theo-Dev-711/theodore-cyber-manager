// 📂 components/DashboardStats.tsx
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
    icon: ReactNode;
    label: string;
    value: number;
    duration?: number; // durée de l'animation en ms (optionnelle)
}

export default function DashboardStats({ icon, label, value, duration = 1000 }: Props) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const startTime = performance.now();

        const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const currentValue = Math.floor(progress * value);
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <div className="card shadow border border-blue-300 h-[7rem] bg-base-100 p-4 flex flex-row items-center justify-between space-x-4">
            <div className="flex items-center gap-2">
                {icon}
                <div className="font-semibold">{label}</div>
            </div>
            <div className="text-2xl font-bold">{count}</div>
        </div>
    );
}
