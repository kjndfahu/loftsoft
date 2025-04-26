"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, File } from "lucide-react"

interface FileUploadItemProps {
    index: number
    onRemove: (index: number) => void
    onChange: (index: number, file: File | null, name: string) => void
    fileName: string
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({ index, onRemove, onChange, fileName }) => {
    const [file, setFile] = useState<File | null>(null)
    const [displayName, setDisplayName] = useState(fileName)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        if (selectedFile) {
            setFile(selectedFile)
            // Если имя отображения пустое, используем имя файла
            const newDisplayName = displayName || selectedFile.name
            setDisplayName(newDisplayName)
            onChange(index, selectedFile, newDisplayName)
            console.log("File selected:", {
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                displayName: newDisplayName,
            })
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value)
        onChange(index, file, e.target.value)
    }

    return (
        <div className="flex items-center gap-3 w-full">
            <div
                className="flex items-center gap-2 px-[15px] py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px] cursor-pointer flex-1"
                onClick={handleFileClick}
            >
                {file ? <File className="w-5 h-5 text-[#161616]" /> : <Upload className="w-5 h-5 text-[#161616]" />}
                <span className="truncate">{file ? file.name : "Выберите файл"}</span>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".exe,.zip,.rar,.7z,.msi,.iso"
                />
            </div>
            <div className="px-[15px] flex-1 py-[10px] border-[1px] border-[#B9BCCB] rounded-[20px]">
                <input
                    className="bg-transparent w-full outline-0 text-[#161616]"
                    placeholder="Отображаемое название"
                    type="text"
                    value={displayName}
                    onChange={handleNameChange}
                />
            </div>
            <button type="button" onClick={() => onRemove(index)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}
