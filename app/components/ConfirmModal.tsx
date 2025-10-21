// 📁 components/ConfirmModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmer",
    cancelText = "Annuler",
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-8 w-[90%] md:w-[400px] flex flex-col items-center gap-6 text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        {message && <p className="text-gray-500 text-sm">{message}</p>}

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
