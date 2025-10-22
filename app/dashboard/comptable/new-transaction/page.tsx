"use client"
import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Category } from "@prisma/client"
import { FormDataType } from "@/type"
import { FileImage } from "lucide-react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { createTransaction, getCategories } from "@/app/action"
import ProductImage from "@/app/components/TransactionImage"

const Page = () => {
  const { user } = useUser()
  const clerkId = user?.id;
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    amount: 0,
    categoryId: "",
    type: "", // valeur par défaut
    imageUrl: "",
  })

  // 🔹 Gestion des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🔹 Gestion du fichier image
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  // 🔹 Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (clerkId) {
          const data = await getCategories()
          if (data) setCategories(data)
        }
      } catch (error) {
        console.error("Erreur de chargement des catégories", error)
      }
    }
    fetchCategories()
  }, [clerkId])

  // 🔹 Soumission du formulaire
  const handleSubmit = async () => {
    if (!clerkId) {
      toast.error("Utilisateur non connecté")
      return
    }

    if (!formData.name || !formData.amount || !formData.categoryId) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!file) {
      toast.error("Image manquante !")
      return
    }

    try {
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

      // 🔹 Mettre à jour le formData avec l'URL de l'image
      const finalFormData = { ...formData, imageUrl: data.path }

      // 🔹 Créer le produit
      const transaction = await createTransaction(finalFormData, clerkId)
      console.log("infos Transaction", transaction)

      toast.success("Transaction créee avec succès ✅")
      router.push("/dashboard/comptable/transaction")
    } catch (error) {
      console.error(error)
      toast.error("Erreur de Transaction")
    } finally {
      setLoading(false) // 🔹 désactive le loader
    }
  }
  const [loading, setLoading] = useState(false)

  return (

    <div className="flex justify-center items-center">
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Créer Une Transaction</h1>
        <section className="flex md:flex-row flex-col">
          <div className="space-y-4 md:w-[450px]">
            <div className="mb-4 flex flex-col gap-2">
              <label className="font-semibold">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full textarea textarea-bordered"
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="font-semibold">Montant</label>
              <input
                type="number"
                name="amount"
                min={0}
                value={formData.amount}
                onChange={handleChange}
                placeholder="Prix"
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="font-semibold">Categorie</label>
              <select
                className="select select-bordered w-full"
                value={formData.categoryId}
                onChange={handleChange}
                name="categoryId"
              >
                <option value="">Sélectionner une Catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="font-semibold">Type de Transaction</label>
              <select
                className="select select-bordered w-full"
                value={formData.type}
                onChange={handleChange}
                name="type"
              >
                <option value="">Sélectionner le type</option>
                <option value="Recette">Recette</option>
                <option value="Depense">Depense</option>

              </select>
            </div>

            
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeFile}
              className="file-input file-input-bordered w-full"
            />
            

            <button
              onClick={handleSubmit}
              disabled={loading} // désactive le bouton pendant le chargement
              className="btn bg-blue-500 hover:text-black text-white flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Création...
                </>
              ) : (
                "Créer la transaction"
              )}
            </button>

          </div>

          <div className="md:ml-4 md:w-[300px] mt-4 md:mt-0 border-2 md:h-[300px] p-5 flex border-primary justify-center items-center rounded-3xl">
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
        </section>
      </div>
    </div>

  )
}

export default Page



