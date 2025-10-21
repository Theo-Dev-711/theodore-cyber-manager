"use client"
import React, { useEffect, useState } from "react"

import { UserDataType } from "@/type"
import { toast } from "react-toastify"
import { createUser, deleteUser, getAllUsers, updateUser } from "@/app/action"
import { useUser } from "@clerk/nextjs"
import { Users } from "lucide-react"
import EmptyState from "@/app/components/EmptyState"
import ConfirmModal from "@/app/components/ConfirmModal"
import UserSkeleton from "@/app/components/UserSkeleton"

const Page = () => {
    const { user } = useUser();
    const clerkId = user?.id

    const [formData, setFormData] = useState<UserDataType>({
        id:"",
        nom: "",
        email: "",
        role: ""
    })

    const [showModal, setShowModal] = useState(false);//gerer l'affichage de la modal
    const [deleteId, setDeleteId] = useState<string | null>(null); // sauvegarder id de l'utilisateur
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);


    //modal user
    const confirmDeleteUser = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            await handleDeleteUser(deleteId);
            setDeleteId(null);
            setShowModal(false);
        }
    };

    
    const handleDeleteUser = async (id: string) => {
        await deleteUser(id);
        await fetchAllUsers();
        toast.success("Utilisateur supprimé avec succès !");
    };

    // 🔹 Gestion des champs
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }


    // 🔹 Soumission du formulaire
    const handleSubmit = async () => {
        if (!formData.nom || !formData.email || !formData.role) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);

        try {
            if (isEditing) {
                // 🔹 Mise à jour d’un utilisateur existant
                await updateUser(formData);
                toast.success("Utilisateur mis à jour avec succès ✅");
                setIsEditing(false);
            } else {
                // 🔹 Création d’un nouvel utilisateur
                await createUser(formData);
                toast.success("Utilisateur créé avec succès ✅");
            }

            await fetchAllUsers();

            // 🔹 Réinitialiser le formulaire après soumission
            setFormData({ id: "", nom: "", email: "", role: "" });
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l’opération.");
        } finally {
            setLoading(false);
        }
    };

    const [loading, setLoading] = useState(false)
    const [User, setUser] = useState<UserDataType[] | undefined>([])

    const fetchAllUsers = async () => {
        try {
            setIsLoadingUsers(true);
            if (clerkId) {
                const users = await getAllUsers();
                if (users) setUser(users);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (clerkId)
            fetchAllUsers()

    }, [clerkId])

    return (

        <div className="w-full  flex flex-col lg:flex-row gap-10 mt-10">
            <div className="w-full h-fit lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
                <div className="mt-">
                    <h1 className="text-2xl font-bold mb-4">Formulaire</h1>

                    <div className="space-y-4">
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Nom"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input input-bordered w-full"
                        />
                        <select
                            className="select select-bordered w-full"
                            value={formData.role}
                            onChange={handleChange}
                            name="role"
                        >
                            <option value="">Sélectionner un Role</option>

                            <option value="ADMIN">ADMIN</option>
                            <option value="COMPTABLE">COMPTABLE</option>

                        </select>


                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`btn ${isEditing ? "bg-green-500" : "bg-blue-500"} hover:text-black text-white flex items-center gap-2`}
                        >
                            {loading ? (
                                <div className="flex flex-row">
                                    {isEditing ? "Mise à jour..." : "Envoi..."}
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                            ) : (
                                isEditing ? "Mettre à jour" : "Soumettre"
                            )}
                        </button>

                    </div>



                </div>
            </div>

            {/* lecture des users */}
            <div className="w-full p-8 bg-white shadow-lg border border-gray-200 rounded-2xl flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Users/>
                    Liste des utilisateurs
                </h1>

                {isLoadingUsers ? (
                    // Skeleton loader pendant le chargement
                    <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <UserSkeleton key={index} />
                        ))}
                    </div>
                ) : User && User.length > 0 ? (
                    // Liste des utilisateurs
                    <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                        {User.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-md rounded-xl p-5 flex flex-col gap-4 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold shadow-inner">
                                        {item.nom.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {item.nom}
                                        </h2>
                                        <p className="text-sm text-gray-500">{item.email}</p>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <span
                                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${item.role === "ADMIN"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {item.role}
                                    </span>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => {
                                            setFormData(item);
                                            setIsEditing(true);
                                        }}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => confirmDeleteUser(item.id!)}
                                        className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                                    >
                                        Supprimer
                                    </button>
                                </div>

                                <ConfirmModal
                                    isOpen={showModal}
                                    title="Supprimer cet utilisateur ?"
                                    message="Tous les transactions associés seront également supprimés."
                                    onConfirm={handleConfirmDelete}
                                    onCancel={() => setShowModal(false)}
                                    confirmText="Supprimer"
                                    cancelText="Annuler"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <EmptyState
                            message="Aucun utilisateur disponible..."
                            IconComponent="UserRoundX"
                        />
                    </div>
                )}

            </div>

        </div>
    )
}

export default Page
