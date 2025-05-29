"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, List, Bold, Italic, LinkIcon, Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { createArticle, updateArticle, uploadKnowledgeBaseMedia } from "@/enteties/knowledge-base/knowledge-base"

interface Category {
    id: number
    name: string
}

interface ContentBlock {
    id: string
    type: "text" | "image" | "list"
    content: any
}

interface KnowledgeBaseArticleEditorProps {
    categories: Category[]
    article?: {
        id: number
        title: string
        content: string
        emoji?: string
        categoryId: number
        order: number
    }
    isEdit?: boolean
}

export const KnowledgeBaseArticleEditor = ({
                                               categories,
                                               article,
                                               isEdit = false,
                                           }: KnowledgeBaseArticleEditorProps) => {
    const router = useRouter()
    const [title, setTitle] = useState(article?.title || "")
    const [emoji, setEmoji] = useState(article?.emoji || "")
    const [categoryId, setCategoryId] = useState<number>(article?.categoryId || categories[0]?.id || 0)
    const [blocks, setBlocks] = useState<ContentBlock[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Initialize blocks from article content if editing
    useEffect(() => {
        if (article?.content) {
            try {
                const parsedContent = JSON.parse(article.content)
                if (Array.isArray(parsedContent)) {
                    setBlocks(parsedContent)
                } else {
                    setBlocks([
                        {
                            id: "1",
                            type: "text",
                            content: typeof parsedContent === "string" ? parsedContent : article.content,
                        },
                    ])
                }
            } catch (e) {
                setBlocks([{ id: "1", type: "text", content: article.content }])
            }
        } else {
            setBlocks([{ id: "1", type: "text", content: "" }])
        }
    }, [article])

    // Add a new content block
    const addBlock = (type: "text" | "image" | "list") => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content: type === "text" ? "" : type === "list" ? { items: [""] } : null,
        }
        setBlocks([...blocks, newBlock])
    }

    // Remove a content block
    const removeBlock = (id: string) => {
        setBlocks(blocks.filter((block) => block.id !== id))
    }

    // Update a content block
    const updateBlock = (id: string, content: any) => {
        setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))
    }

    // Handle media upload for a block
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const blockIndex = blocks.findIndex((block) => block.id === blockId)

            if (blockIndex !== -1) {
                setIsLoading(true)
                try {
                    console.log("Uploading file:", file.name)
                    const formData = new FormData()
                    formData.append("file", file)
                    const uploadResult = await uploadKnowledgeBaseMedia(formData)
                    console.log("Upload result:", uploadResult)
                    if (uploadResult.success) {
                        const updatedBlocks = [...blocks]
                        updatedBlocks[blockIndex].content = uploadResult.url
                        setBlocks(updatedBlocks)
                    } else {
                        alert(`Failed to upload image: ${uploadResult.error}`)
                    }
                } catch (error) {
                    console.error("Error uploading image:", error)
                    alert("Error uploading image")
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }

    // Update list item
    const updateListItem = (blockId: string, index: number, value: string) => {
        const block = blocks.find((b) => b.id === blockId)
        if (block && block.type === "list") {
            const newItems = [...block.content.items]
            newItems[index] = value
            updateBlock(blockId, { items: newItems })
        }
    }

    // Add list item
    const addListItem = (blockId: string) => {
        const block = blocks.find((b) => b.id === blockId)
        if (block && block.type === "list") {
            const newItems = [...block.content.items, ""]
            updateBlock(blockId, { items: newItems })
        }
    }

    // Remove list item
    const removeListItem = (blockId: string, index: number) => {
        const block = blocks.find((b) => b.id === blockId)
        if (block && block.type === "list" && block.content.items.length > 1) {
            const newItems = [...block.content.items]
            newItems.splice(index, 1)
            updateBlock(blockId, { items: newItems })
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setIsLoading(true)

        try {
            const articleData = {
                title,
                content: JSON.stringify(blocks),
                emoji,
                categoryId,
                order: article?.order || 0,
            }

            let result
            if (isEdit && article) {
                result = await updateArticle(article.id, articleData)
            } else {
                result = await createArticle(articleData)
            }

            if (result.success) {
                router.push("/admin-knowledge-base")
                router.refresh()
            } else {
                alert(`Failed to ${isEdit ? "update" : "create"} article: ${result.error}`)
            }
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} article:`, error)
            alert(`Error ${isEdit ? "updating" : "creating"} article: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
            setIsSubmitting(false)
            setIsLoading(false)
        }
    }

    // Render the appropriate editor for each block type
    const renderBlockEditor = (block: ContentBlock) => {
        switch (block.type) {
            case "text":
                return (
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                onClick={() => {
                                    const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement
                                    if (textarea) {
                                        const start = textarea.selectionStart
                                        const end = textarea.selectionEnd
                                        const text = textarea.value
                                        const before = text.substring(0, start)
                                        const selection = text.substring(start, end)
                                        const after = text.substring(end)
                                        const newText = before + `<strong>${selection}</strong>` + after
                                        updateBlock(block.id, newText)
                                        setTimeout(() => {
                                            textarea.focus()
                                            textarea.setSelectionRange(start + 8, start + 8 + selection.length)
                                        }, 0)
                                    }
                                }}
                            >
                                <Bold size={16} />
                            </button>
                            <button
                                type="button"
                                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                onClick={() => {
                                    const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement
                                    if (textarea) {
                                        const start = textarea.selectionStart
                                        const end = textarea.selectionEnd
                                        const text = textarea.value
                                        const before = text.substring(0, start)
                                        const selection = text.substring(start, end)
                                        const after = text.substring(end)
                                        const newText = before + `<em>${selection}</em>` + after
                                        updateBlock(block.id, newText)
                                        setTimeout(() => {
                                            textarea.focus()
                                            textarea.setSelectionRange(start + 4, start + 4 + selection.length)
                                        }, 0)
                                    }
                                }}
                            >
                                <Italic size={16} />
                            </button>
                            <button
                                type="button"
                                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                                onClick={() => {
                                    const url = prompt("Enter URL:")
                                    if (url) {
                                        const textarea = document.getElementById(`text-${block.id}`) as HTMLTextAreaElement
                                        if (textarea) {
                                            const start = textarea.selectionStart
                                            const end = textarea.selectionEnd
                                            const text = textarea.value
                                            const before = text.substring(0, start)
                                            const selection = text.substring(start, end)
                                            const after = text.substring(end)
                                            const linkText = selection || "Link text"
                                            const newText = before + `<a href="${url}">${linkText}</a>` + after
                                            updateBlock(block.id, newText)
                                        }
                                    }
                                }}
                            >
                                <LinkIcon size={16} />
                            </button>
                        </div>
                        <textarea
                            id={`text-${block.id}`}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            placeholder="Введите текст..."
                            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                )

            case "image":
                return (
                    <div className="space-y-4">
                        {block.content ? (
                            <div className="relative h-64 w-full">
                                <Image src={block.content || "/placeholder.svg"} alt="Article image" fill className="object-contain" />
                            </div>
                        ) : (
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Нажмите для загрузки изображения</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        console.log("File input triggered", e.target.files)
                                        handleMediaUpload(e, block.id)
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                        )}
                        {block.content && (
                            <div className="flex justify-between items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMediaUpload(e, block.id)}
                                    className="text-sm p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        )}
                    </div>
                )

            case "list":
                return (
                    <div className="space-y-2">
                        <div className="space-y-2">
                            {block.content.items.map((item: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="text-gray-500">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(block.id, index, e.target.value)}
                                        placeholder={`Пункт ${index + 1}`}
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                    />
                                    {block.content.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeListItem(block.id, index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addListItem(block.id)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <Plus size={16} className="mr-1" />
                            Добавить пункт
                        </button>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center text-black gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Назад
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !title || !categoryId}
                    className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ml-auto ${
                        isSubmitting || !title || !categoryId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? "Сохранение..." : isEdit ? "Обновить статью" : "Сохранить статью"}
                    <Save size={16} />
                </button>
            </div>

            <div className="space-y-4 text-black">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Заголовок статьи</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите заголовок статьи"
                            required
                            className="w-full p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Категория</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-8 text-black">
                <h2 className="text-xl font-semibold">Содержание статьи</h2>

                {blocks.map((block, index) => (
                    <div key={block.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Блок {index + 1}:</span>
                                <span className="text-sm text-gray-500">
                                    {block.type === "text" ? "Текст" : block.type === "image" ? "Изображение" : "Список"}
                                </span>
                            </div>
                            <button
                                type="button"
                                className={`p-1 text-red-500 hover:text-red-700 ${blocks.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => removeBlock(block.id)}
                                disabled={blocks.length === 1}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        {renderBlockEditor(block)}
                    </div>
                ))}

                <div className="flex flex-wrap gap-2 pt-4">
                    <button
                        type="button"
                        onClick={() => addBlock("text")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <Plus size={16} /> Текст
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("image")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <ImageIcon size={16} /> Изображение
                    </button>
                    <button
                        type="button"
                        onClick={() => addBlock("list")}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        <List size={16} /> Список
                    </button>
                </div>
            </div>
        </form>
    )
}