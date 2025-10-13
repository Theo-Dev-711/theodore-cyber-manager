"use client"
import React, { useEffect, useState } from 'react'


import { useUser } from '@clerk/nextjs'

import { toast } from 'react-toastify'
import { Category } from '@prisma/client'
import { Pencil, Trash } from 'lucide-react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/app/action'
import CategoryModal from '@/app/components/categoryModal'
import EmptyState from '@/app/components/EmptyState'



const Page = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [editmode, setEditMode] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categories, setcategories] = useState<Category[]>([])
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress

  const loadCategories = async () => {
    if (email) {
      const data = await getCategories()
      if (data)
        setcategories(data)
    }
  }

  useEffect(() => {
    if (email)
      loadCategories()
  }, [email])

  const openCreateModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
  }

  const closeModal = () => {
    setName("");
    setDescription("");
    setEditMode(false);
    (document.getElementById("category_modal") as HTMLDialogElement)?.close()
  }
  const openEditModal = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setEditMode(true);
    (document.getElementById("category_modal") as HTMLDialogElement)?.showModal()
  }
  const handleCreateCategory = async () => {
    setLoading(true)
    if (email) {
      await createCategory(name,  description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Category mise à jour avec succès!", {
      className: "bg-[var(--toastify-color-light)] text-[var(--toastify-text-color-light)] font-bold",
    });


  }
  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return
    setLoading(true)
    if (email) {
      await updateCategory(editingCategoryId,  name, description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Category mise à jour  avec succès!")
  }
  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cette categorie ? Tous les transctions associés seront egalement supprimés")
    if (!confirmDelete) return;
    await deleteCategory(categoryId);
    await loadCategories();
    toast.success("Categorie supprimée avec succès!")
  }

  return (
    <>
      <div className='mt-10'>
        <div className='mb-4'>

          <button
            onClick={openCreateModal}
            disabled={loading} // désactive le bouton pendant le chargement
            className="btn bg-blue-500 hover:text-black text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Ajout...
              </>
            ) : (
              "Ajouter"
            )}
          </button>
        </div>
      </div>
      {categories.length > 0 ? (
        <div>
          {categories.map((category) => (
            <div key={category.id} className='flex rounded-xl justify-between text-base-600 items-center p-5 mb-2 border border-base-200'>
              <div>
                <strong className='text-lg'>{category.name}</strong>
                <p className='text-sm'>{category.description}</p>

              </div>
              <div className='flex gap-4 items-center'>
                <button className='btn btn-sm ' onClick={() => openEditModal(category)}>
                  <Pencil className='w-4 h-4' />
                </button>
                <button className='btn btn-sm btn-error' onClick={() => handleDeleteCategory(category.id)}>
                  <Trash className='w-4 h-4' />
                </button>


              </div>

            </div>
          ))}
        </div>

      ) : (<EmptyState
        IconComponent='Group'
        message='Aucune Categorie disponible !'
      />)}
      <CategoryModal
        name={name}
        description={description}
        loading={loading}
        onChangeName={setName}
        onchangeDescription={setDescription}
        onSubmit={editmode ? handleUpdateCategory : handleCreateCategory}
        editmode={editmode}
        onclose={closeModal}
      />

    </>


  )
}

export default Page

