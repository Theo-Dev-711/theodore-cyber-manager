// 📂 components/DashboardHeader.tsx
import React from "react";

export default function DashboardHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{title}</h1>
        </div>
    );
}
