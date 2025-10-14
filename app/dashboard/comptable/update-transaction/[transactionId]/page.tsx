"use client"
import React, { useEffect, useState } from "react"

import { TransactionWithCategory } from "@/type"
import { useUser } from "@clerk/nextjs"
import { FormDataType } from "@/type"

import { FileImage } from 'lucide-react'
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { readTransactionById, updateTransaction } from "@/app/action"
import ProductImage from "@/app/components/TransactionImage"



const Page = ({ params }: { params: Promise<{ transactionId: string }> }) => {
    const { user } = useUser()
    const clerkId = user?.id
    const router = useRouter()


    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [transaction, setTransaction] = useState<TransactionWithCategory | null>(null)
    const [formData, setFormData] = useState<FormDataType>({
        id: "",
        name: "",
        description: "" ,
        amount: 0,
        type:"",
        imageUrl: "",
        categoryName: "",
        categoryId:""
    })

    const fetchTransactions = async () => {
        try {
            const { transactionId } = await params
            if (clerkId) {
                const fetchedTransaction = await readTransactionById(transactionId, clerkId)
                if (fetchedTransaction) {
                    setTransaction(fetchedTransaction)
                    setFormData({
                        id: fetchedTransaction.id,
                        name: fetchedTransaction.name,
                        description: fetchedTransaction.description,
                        amount: fetchedTransaction.amount,
                        type: fetchedTransaction.type,
                        imageUrl: fetchedTransaction.imageUrl,
                        categoryId:fetchedTransaction.categoryId,
                        categoryName: fetchedTransaction.categoryName
                    })
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [clerkId])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        setFile(selectedFile)
        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        let imageUrl = formData.imageUrl;
        e.preventDefault()
        try {
            setLoading(true)
            if (file) {
                const resDelete = await fetch("/api/uploads", {
                    method: 'DELETE',
                    body: JSON.stringify({ path: formData.imageUrl }),
                    headers: { 'Content-Type': 'application/json' }
                })
                const dataDelete = await resDelete.json()
                if (!dataDelete.success) {
                    throw new Error("Erreur lors de la suppression de l'image."),
                    toast.error("Erreur lors de la suppression de l'image.")
                }
                // Upload image
                const imageData = new FormData()
                imageData.append("file", file)

                const res = await fetch("/api/uploads", {
                    method: "POST",
                    body: imageData,
                })

                const data = await res.json()

                if (!data.success) {
                    throw new Error("Erreur lors de l'upload de l'image.")
                }

                imageUrl = data.path
                formData.imageUrl = imageUrl
                await updateTransaction(formData, clerkId as string)
                toast.success("Transaction mis à jour avec succès !")
                router.push("/dashboard/comptable/transaction")

                // 🔹 Mettre à jour le formData avec l'URL de l'image
            } else {
                toast.error("Image introuvable")
            }
        } catch (error) {
            console.error(error)

        }finally{
            setLoading(false)
        }

    }



    return (
       
            <div className="mt-10">
                {transaction ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">
                            Mise à jour de la Transaction
                        </h1>
                        <div className="flex md:flex-row flex-col md:items-center">
                            <form className="space-y-2" onSubmit={handleSubmit}>
                                <h1 className="text-sm font-semibold">Nom</h1>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nom"
                                    className="input input-bordered w-full"
                                />
                                <h1 className="text-sm font-semibold mb-2">Description</h1>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    className="w-full textarea textarea-bordered"
                                />

                                <h1 className="text-sm font-semibold mb-2">Categorie</h1>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    disabled
                                />
                                <h1 className="text-sm font-semibold mb-2">Image / Prix unitaire</h1>
                                <div className="flex">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChangeFile}
                                        className="file-input file-input-bordered w-full"
                                    />

                                    <input
                                        type="number"
                                        name="amount"
                                        min={0}
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Prix"
                                        className="input input-bordered w-full ml-4 mb-3"
                                    />
                                </div>
                            <button
                                disabled={loading} // désactive le bouton pendant le chargement
                                className="btn bg-blue-500 hover:text-black text-white flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Mise à jour...
                                    </>
                                ) : (
                                    "Mettre à jour"
                                )}
                            </button>
                            </form>
                            <div className="flex md:flex-col md:ml-4 mt-4 md:mt-0 space-y-4">
                                {/* image recuper provenant du backend  */}
                                <div className="md:ml-4 md:w-[200px] mt-4 md:mt-0 border-2 md:h-[200px]  p-5 max-md:hidden md:flex border-primary justify-center items-center rounded-3xl">
                                    {formData.imageUrl ? (
                                        <ProductImage
                                            src={formData.imageUrl}
                                            alt={transaction.name}
                                            heightClass="h-40"
                                            widthClass="h-40"
                                        />
                                    ) : (
                                        <div className="wiggle-animation">
                                            <FileImage
                                                strokeWidth={1}
                                                className="h-10 w-10 text-primary"
                                            />
                                        </div>

                                    )}
                                </div>
                                {/* image pour modification  */}
                                <div className="md:ml-4 md:w-[200px] max-md:w-full mt-4 md:mt-0 border-2 md:h-[200px] p-5 flex border-primary justify-center items-center rounded-3xl">
                                    {previewUrl ? (
                                        <ProductImage
                                            src={previewUrl}
                                            alt="Preview"
                                            heightClass="h-40"
                                            widthClass="h-40"
                                        />
                                    ) : (
                                        <div className="wiggle-animation">
                                            <FileImage
                                                strokeWidth={1}
                                                className="h-10 w-10 text-primary"
                                            />
                                        </div>

                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                )}
            </div>
    )
}

export default Page


