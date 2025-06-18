// /src/components/file-upload-item.tsx
"use client";

import type { FC } from "react";
import { useRef, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { uploadFileToGCS } from "@/enteties/auth/upload-to-gcs";

interface Props {
    index: number;
    fileName: string;
    fileUrl?: string;
    onChange: (index: number, file: File | null, displayName: string, fileUrl?: string) => void;
    onRemove: (index: number) => void;
    onUploadSuccess: (index: number, fileUrl: string) => void;
}

export const FileUploadItem: FC<Props> = ({ index, fileName, fileUrl, onChange, onRemove, onUploadSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isUrlInput, setIsUrlInput] = useState(!!fileUrl);
    const [url, setUrl] = useState(fileUrl || "");
    const [displayName, setDisplayName] = useState(fileName);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setUploading(true);
            setUploadSuccess(false);
            setDisplayName(file.name);

            const arrayBuffer = await file.arrayBuffer();
            const fileData = {
                name: file.name,
                type: file.type,
                content: Array.from(new Uint8Array(arrayBuffer)),
            };

            const result = await uploadFileToGCS(fileData);
            setUploading(false);

            if (result.success && result.fileUrl) {
                onChange(index, file, displayName, result.fileUrl);
                onUploadSuccess(index, result.fileUrl);
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            } else {
                console.error("Failed to upload file:", result.error);
                onChange(index, null, displayName, undefined);
            }
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setDisplayName(newUrl ? "URL Distributive" : "");
        onChange(index, null, newUrl ? "URL Distributive" : "", newUrl);
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
        onChange(index, null, e.target.value, fileUrl);
    };

    const handleClick = () => {
        if (!isUrlInput) {
            fileInputRef.current?.click();
        }
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
                <div className="flex-1">
                    <input
                        type="text"
                        value={displayName}
                        onChange={handleDisplayNameChange}
                        placeholder="Введите название файла"
                        className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px] mb-2"
                    />
                    <button
                        type="button"
                        onClick={handleClick}
                        className="px-3 py-1 bg-[#DBDEEF] rounded-[10px] text-[#161616]"
                        disabled={uploading}
                    >
                        {uploading ? "Загрузка..." : fileUrl ? "Перезагрузить" : "Выбрать файл"}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".exe, .torrent" // Allow .exe and .torrent uploads
                        className="hidden"
                    />
                </div>
            )}
            <button
                type="button"
                onClick={() => setIsUrlInput(!isUrlInput)}
                className="text-[#161616]"
            >
                {isUrlInput ? "Загрузить файл" : "Ввести URL"}
            </button>
            {uploadSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
            {fileUrl && !uploadSuccess && <span className="text-green-500 text-sm">Загружено</span>}
            <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};