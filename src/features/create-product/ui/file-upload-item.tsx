import type { FC } from "react";
import { useRef } from "react";
import { X } from "lucide-react";

interface Props {
    index: number;
    fileName: string;
    onChange: (index: number, file: File | null, displayName: string) => void;
    onRemove: (index: number) => void;
}

export const FileUploadItem: FC<Props> = ({ index, fileName, onChange, onRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        console.log("File selected in FileUploadItem:", file?.name, "Size:", file?.size);
        onChange(index, file, fileName);
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(index, null, e.target.value);
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
            >
                Выбрать файл
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".exe"
                className="hidden"
            />
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-[#161616]"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};