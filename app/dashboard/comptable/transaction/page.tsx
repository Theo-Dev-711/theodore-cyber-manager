"use client"
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { TransactionWithCategory } from '@/type'

import Link from 'next/link'
import { toast } from "react-toastify"
import { Trash } from 'lucide-react'
import { deleteTransaction, getTransactions } from '@/app/action'
import { Transaction } from '@prisma/client'
import EmptyState from '@/app/components/EmptyState'
import TransactionImage from '@/app/components/TransactionImage'

const Page = () => {
    const { user } = useUser()
    const clerkId = user?.id;
    const [transactions, setTransaction] = useState<TransactionWithCategory[] | undefined>([])
    const fetchProducts = async () => {
        try {
            if (clerkId) {
                const transactions = await getTransactions(clerkId)
                if (transactions)
                    setTransaction(transactions)

            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        if (clerkId)
            fetchProducts()

    }, [clerkId])

    const handleDeleteTransaction = async (transaction: Transaction) => {
        const confirmDelete = confirm("Voulez-vous vraiment supprimer ce produit ?")
        if (!confirmDelete) return;
        try {
            if (transaction.imageUrl) {
                const resDelete = await fetch("/api/uploads", {
                    method: 'DELETE',
                    body: JSON.stringify({ path: transaction.imageUrl }),
                    headers: { 'Content-Type': 'application/json' }
                })
                const dataDelete = await resDelete.json()
                if (!dataDelete.success) {
                    throw new Error("Erreur lors de la suppression de l'image."),
                    toast.error("Erreur lors de la suppression de l'image.")
                } else {
                    if (clerkId) {
                        await deleteTransaction(transaction.id, clerkId)
                        await fetchProducts()
                        toast.success("Transaction supprimé avec succès")
                    }
                }
            }
        } catch (error) {

        }
    }
    return (
        
            <div className='overflow-x-auto'>
                {transactions?.length === 0 ? (
                    <div>
                        <EmptyState
                            message='Aucun produit disponible'
                            IconComponent={`PackageSearch`} />

                    </div>
                ) : (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Prix</th>
                                <th>Type</th>
                                <th>Categorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.map((transaction, index) => (
                                <tr key={transaction.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <TransactionImage
                                            src={transaction.imageUrl || "/placeholder-image.jpg"}
                                            alt={transaction.imageUrl || "Image de transaction"}
                                            heightClass='h-12'
                                            widthClass='h-12'
                                        />
                                    </td>
                                    <td>
                                        {transaction.name}
                                    </td>
                                    <td>
                                        {transaction.description}
                                    </td>
                                    <td>
                                        {transaction.amount} $
                                    </td>
                                    <td className='capitalize'>
                                        {transaction.type}
                                    </td>
                                    <td>
                                        {transaction.categoryName}
                                    </td>
                                    <td className='flex gap-2 flex-col'>
                                        <Link
                                            className="btn btn-xs w-fit btn-primary"
                                            href={`/update-product/${transaction.id}`}
                                        >
                                            Modifier
                                        </Link>

                                        <button onClick={() => handleDeleteTransaction(transaction)} className='btn btn-xs w-fit'>
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
