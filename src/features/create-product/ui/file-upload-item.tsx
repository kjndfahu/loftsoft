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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setUploading(true);
            setUploadSuccess(false);
            console.log("File selected in FileUploadItem:", file?.name, "Size:", file?.size);

            const arrayBuffer = await file.arrayBuffer();
            const fileData = {
                name: file.name,
                type: file.type,
                content: Array.from(new Uint8Array(arrayBuffer)),
            };

            const result = await uploadFileToGCS(fileData);
            setUploading(false);

            if (result.success && result.fileUrl) {
                onChange(index, file, fileName, result.fileUrl);
                onUploadSuccess(index, result.fileUrl);
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            } else {
                console.error("Failed to upload file:", result.error);
                onChange(index, null, fileName, undefined);
            }
        }
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(index, null, e.target.value, fileUrl);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-2 border-[1px] border-[#B9BCCB] rounded-[10px] p-2">
            <input
                type="text"
                value={fileName}
                onChange={handleDisplayNameChange}
                placeholder="Название дистрибутива"
                className="flex-1 bg-transparent outline-0 text-[#161616]"
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
                accept=".exe"
                className="hidden"
            />
            {uploadSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
            {fileUrl && !uploadSuccess && <span className="text-green-500 text-sm">Загружено</span>}
            <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};