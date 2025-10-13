"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { TransactionWithCategory } from "@/type";
import TransactionImage from "@/app/components/TransactionImage";
import EmptyState from "@/app/components/EmptyState";
import { getTransactions } from "@/app/action";


const TransactionsPage = () => {
    const { user } = useUser();
    const clerkId = user?.id;
    const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);

    const fetchTransactions = async () => {
        if (!clerkId) return;
        try {
            const data = await getTransactions(clerkId);
            if (data) setTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [clerkId]);

    return (
        <div className="overflow-x-auto">
            {transactions.length === 0 ? (
                <EmptyState message="Aucune transaction disponible" IconComponent={`PackageSearch`} />
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Montant</th>
                            <th>Type</th>
                            <th>Catégorie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={tx.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <TransactionImage
                                        src={tx.imageUrl || "/placeholder-image.jpg"}
                                        alt={tx.imageUrl || "Transaction Image"}
                                        heightClass="h-12"
                                        widthClass="h-12"
                                    />
                                </td>
                                <td>{tx.name}</td>
                                <td>{tx.description}</td>
                                <td>{tx.amount} $</td>
                                <td className="capitalize">{tx.type}</td>
                                <td>{tx.categoryName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransactionsPage;
