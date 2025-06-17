// /src/components/file-upload-item.tsx
"use client";

import type React from "react";
import { useState, useRef } from "react";
import { UploadIcon, X } from "lucide-react";

interface FileUploadItemProps {
    index: number;
    fileName: string;
    fileUrl?: string;
    onChange: (index: number, file: File | null, displayName: string, fileUrl?: string, isUrl?: boolean) => void;
    onRemove: (index: number) => void;
    onUploadSuccess: (index: number, fileUrl: string) => void;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({ index, fileName, fileUrl, onChange, onRemove, onUploadSuccess }) => {
    const [isUrlInput, setIsUrlInput] = useState(!!fileUrl);
    const [url, setUrl] = useState(fileUrl || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            onChange(index, file, file.name, undefined, false);
            try {
                const formData = new FormData();
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
                const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

                if (!uploadPreset || !uploadUrl) {
                    throw new Error("Cloudinary configuration is missing");
                }

                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    onUploadSuccess(index, data.secure_url);
                } else {
                    throw new Error("Failed to upload file");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        onChange(index, null, newUrl ? "URL Distributive" : "", newUrl, true);
    };

    return (
        <div className="flex items-center gap-2">
            {isUrlInput ? (
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Введите URL дистрибутива"
                        value={url}
                        onChange={handleUrlChange}
                        className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px]"
                    />
                </div>
            ) : (
                <div
                    className="flex-1 px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px] cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <span className="truncate">{fileName || "Выберите файл"}</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}
            <button type="button" onClick={() => setIsUrlInput(!isUrlInput)} className="text-[#161616]">
                {isUrlInput ? "Загрузить файл" : "Ввести URL"}
            </button>
            <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};