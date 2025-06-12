import type { FC } from "react";
import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface Props {
    index: number;
    fileName: string;
    fileUrl?: string;
    onChange: (index: number, displayName: string, fileUrl?: string) => void;
    onRemove: (index: number) => void;
}

export const FileUploadItem: FC<Props> = ({ index, fileName, fileUrl, onChange, onRemove }) => {
    const [url, setUrl] = useState(fileUrl || "");
    const [isValidUrl, setIsValidUrl] = useState(true);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        try {
            new URL(newUrl);
            setIsValidUrl(true);
            onChange(index, fileName, newUrl);
        } catch {
            setIsValidUrl(false);
            onChange(index, fileName, undefined);
        }
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(index, e.target.value, url);
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
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="Введите URL дистрибутива"
                className={`flex-1 bg-transparent outline-0 text-[#161616] ${isValidUrl ? "" : "border-red-500"}`}
            />
            {url && isValidUrl && <CheckCircle className="w-5 h-5 text-green-500" />}
            {!isValidUrl && <span className="text-red-500 text-sm">Недействительный URL</span>}
            <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};