"use client"
import React, { useEffect, useState } from 'react'


import { useUser } from '@clerk/nextjs'

import { toast } from 'react-toastify'
import { Category } from '@prisma/client'
import { Pencil, Trash } from 'lucide-react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/app/action'
import CategoryModal from '@/app/components/categoryModal'
import EmptyState from '@/app/components/EmptyState'
import ConfirmModal from '@/app/components/ConfirmModal'



const Page = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [editmode, setEditMode] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categories, setcategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false);//gerer l'affichage de la modal
  const [deleteId, setDeleteId] = useState<string | null>(null); // sauvegarder id de l'utilisateur
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
      await createCategory(name, description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Category creer avec succès!");


  }
  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return
    setLoading(true)
    if (email) {
      await updateCategory(editingCategoryId, name, description)
    }
    await loadCategories()
    closeModal()
    setLoading(false)
    toast.success("Category mise à jour  avec succès!")
  }
  const handleDeleteCategory = async (categoryId: string) => {
    // const confirmDelete = confirm("Voulez-vous vraiment supprimer cette categorie ? Tous les transctions associés seront egalement supprimés")
    await deleteCategory(categoryId);
    await loadCategories();
    toast.success("Categorie supprimée avec succès!")
  }

  //modal user. Recuper L'id de l'utilisateur dans la modal
  const confirmDeleteUser = (categoryId: string) => {
    setDeleteId(categoryId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await handleDeleteCategory(deleteId);
      setDeleteId(null);
      setShowModal(false);
    }
  };


  return (
    <>
      <div className='mt-10'>
        <div className='mb-4'>
          <h1 className='text-xl mb-4 text-black font-semibold'>Ajouter une Categorie</h1>
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
        <div className='flex flex-col gap-5'>
          {categories.map((category) => (
            <div key={category.id} className='flex bg-red-600 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-600 shadow justify-between  items-center p-5 mb-2 '>
              <div>
                <strong className='text-lg'>{category.name}</strong>
                <p className='text-sm'>{category.description}</p>
              </div>
              <div className='flex gap-4 items-center'>
                <button className='btn btn-sm bg-green-500' onClick={() => openEditModal(category)}>
                  <Pencil className='w-4 h-4' />
                </button>
                <button className='btn btn-sm btn-error' onClick={() => confirmDeleteUser(category.id)}>
                  <Trash className='w-4 h-4' />
                </button>
                <ConfirmModal
                  isOpen={showModal}
                  title="Voulez-vous vraiment supprimer cette categorie ?"
                  message="Tous les transactions associés seront également supprimés."
                  onConfirm={handleConfirmDelete}
                  onCancel={() => setShowModal(false)}
                  confirmText="Supprimer"
                  cancelText="Annuler"
                />
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

