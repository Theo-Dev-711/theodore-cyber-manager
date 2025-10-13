"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { toast } from "react-toastify"
import { Trash } from 'lucide-react'

import EmptyState from '@/app/components/EmptyState'
import TransactionImage from '@/app/components/TransactionImage'
import { getTransactions, deleteTransaction } from '@/app/action'
import { TransactionWithCategory } from '@/type'

const Page = () => {
    const { user } = useUser()
    const clerkId = user?.id
    const [transactions, setTransactions] = useState<TransactionWithCategory[]>([])

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            if (clerkId) {
                const txs = await getTransactions(clerkId)
                if (txs) setTransactions(txs)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors du chargement des transactions")
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [clerkId])

    // Supprimer une transaction
    const handleDeleteTransaction = async (transaction: TransactionWithCategory) => {
        const confirmDelete = confirm("Voulez-vous vraiment supprimer cette transaction ?")
        if (!confirmDelete) return

        try {
            if (transaction.imageUrl) {
                const resDelete = await fetch("/api/uploads", {
                    method: 'DELETE',
                    body: JSON.stringify({ path: transaction.imageUrl }),
                    headers: { 'Content-Type': 'application/json' }
                })

                const dataDelete = await resDelete.json()
                if (!dataDelete.success) {
                    toast.error("Erreur lors de la suppression de l'image.")
                    return
                }
            }

            if (clerkId) {
                await deleteTransaction(transaction.id, clerkId)
                toast.success("Transaction supprimée avec succès")
                await fetchTransactions()
            }
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la suppression")
        }
    }

    return (
        <div className='overflow-x-auto'>
            {transactions.length === 0 ? (
                <EmptyState message='Aucune transaction disponible' IconComponent="PackageSearch" />
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Montant</th>
                            <th>Type</th>
                            <th>Catégorie</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={tx.id}>
                                <th>{index + 1}</th>
                                <td>
                                    <TransactionImage
                                        src={tx.imageUrl ?? "/placeholder-image.jpg"}
                                        alt={tx.imageUrl ?? "Transaction Image"}
                                        heightClass="h-12"
                                        widthClass="h-12"
                                    />
                                </td>
                                <td>{tx.name}</td>
                                <td>{tx.description ?? "-"}</td>
                                <td>{tx.amount} $</td>
                                <td className='capitalize'>{tx.type}</td>
                                <td>{tx.categoryName}</td>
                                <td className='flex gap-2 flex-col'>
                                    <Link
                                        className="btn btn-xs w-fit btn-primary"
                                        href={`/update-transaction/${tx.id}`}
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteTransaction(tx)}
                                        className='btn btn-xs w-fit'
                                    >
                                        <Trash className='w-4 h-4' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Page
