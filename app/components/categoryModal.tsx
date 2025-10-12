import React from 'react'

interface Props {
    name: string,
    description: string,
    loading: boolean,
    onclose: () => void,
    onChangeName: (value: string) => void,
    onchangeDescription: (value: string) => void,
    onSubmit: () => void,
    editmode?: boolean

}
const CategoryModal: React.FC<Props> = ({ name, description, loading, onclose, onChangeName, onchangeDescription, onSubmit,
    editmode
}) => {
    return (
        <div className=''>
            <dialog id="category_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={onclose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">{editmode ? "Modifier la catégorie" : "Nouvelle catégorie"}</h3>
                    <input
                        placeholder='Nom'
                        value={name}
                        onChange={(e) => onChangeName(e.target.value)}
                        type='text'
                        className='input input-bordered  w-full mb-4'
                    />
                    <input
                        placeholder='Description'
                        value={description}
                        onChange={(e) => onchangeDescription(e.target.value)}
                        type='text'
                        className='input input-bordered w-full mb-4'
                    />
                    <button onClick={onSubmit} disabled={loading} className='btn  btn-primary'>
                        {
                            loading ?
                                editmode ? "Modification..." : "Ajout..." :
                                editmode ? "Modifier" : "Ajouter"
                        }
                    </button>
                </div>
            </dialog>
        </div>
    )
}

export default CategoryModal
