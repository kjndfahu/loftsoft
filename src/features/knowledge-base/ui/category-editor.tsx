"use client";

import type React from "react";
import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory, updateCategoryOrder } from "@/enteties/knowledge-base/knowledge-base";

interface Category {
    id: number;
    name: string;
    emoji: string;
    order: number;
}

interface CategoryEditorProps {
    categories: Category[];
    onCategoryUpdate: () => void; // Новый проп для обновления категорий
}

export const CategoryEditor = ({ categories, onCategoryUpdate }: CategoryEditorProps) => {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("📄");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createCategory({
                name,
                emoji,
                order: categories.length,
            });

            if (result.success) {
                setName("");
                setEmoji("📄");
                onCategoryUpdate(); // Вызываем коллбэк для обновления категорий
            } else {
                alert(`Failed to create category: ${result.error}`);
            }
        } catch (error) {
            console.error("Error creating category:", error);
            alert(`Error creating category: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMoveUp = async (id: number, currentOrder: number) => {
        if (currentOrder === 0) return;

        try {
            await updateCategoryOrder(id, currentOrder - 1);

            // Find the category that's currently at the position we're moving to
            const categoryToMoveDown = categories.find((cat) => cat.order === currentOrder - 1);
            if (categoryToMoveDown) {
                await updateCategoryOrder(categoryToMoveDown.id, currentOrder);
            }

            onCategoryUpdate(); // Вызываем коллбэк для обновления категорий
        } catch (error) {
            console.error("Error reordering categories:", error);
        }
    };

    const handleMoveDown = async (id: number, currentOrder: number) => {
        if (currentOrder === categories.length - 1) return;

        try {
            await updateCategoryOrder(id, currentOrder + 1);

            // Find the category that's currently at the position we're moving to
            const categoryToMoveUp = categories.find((cat) => cat.order === currentOrder + 1);
            if (categoryToMoveUp) {
                await updateCategoryOrder(categoryToMoveUp.id, currentOrder);
            }

            onCategoryUpdate(); // Вызываем коллбэк для обновления категорий
        } catch (error) {
            console.error("Error reordering categories:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (
            !confirm("Are you sure you want to delete this category? All articles in this category will also be deleted.")
        ) {
            return;
        }

        try {
            await deleteCategory(id);
            onCategoryUpdate(); // Вызываем коллбэк для обновления категорий
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Управление категориями</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Название категории</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Введите название категории"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Эмодзи</label>
                        <input
                            type="text"
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                            placeholder="Эмодзи для категории"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !name}
                    className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
                        isSubmitting || !name ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <Plus size={16} />
                    Добавить категорию
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Существующие категории</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                        >
                            <div className="flex items-center space-x-2">
                                <span>{category.emoji}</span>
                                <span>{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleMoveUp(category.id, category.order)}
                                    disabled={category.order === 0}
                                    className={`p-1 text-gray-500 hover:text-gray-700 ${
                                        category.order === 0 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    onClick={() => handleMoveDown(category.id, category.order)}
                                    disabled={category.order === categories.length - 1}
                                    className={`p-1 text-gray-500 hover:text-gray-700 ${
                                        category.order === categories.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};