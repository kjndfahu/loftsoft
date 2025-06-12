import type { FC } from "react";
import { useRef, useState } from "react";
import { UploadIcon, X } from "lucide-react";
import Image from "next/image";

interface Props {
    index: number;
    displayName: string;
    fileUrl: string;
    logoUrl?: string;
    onUpdate: (index: number, displayName: string, iconUrl?: string, logoUrl?: string) => void;
    onRemove: (index: number) => void;
}

export const DistributiveDetails: FC<Props> = ({ index, displayName, fileUrl, logoUrl, onUpdate, onRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [name, setName] = useState(displayName);

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleLogoClick = () => {
        logoInputRef.current?.click();
    };

    const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
                    setIconUrl(data.secure_url);
                    onUpdate(index, name, data.secure_url, logoUrl);
                }
            } catch (error) {
                console.error("Ошибка при загрузке иконки:", error);
            }
        }
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
                    onUpdate(index, name, iconUrl, data.secure_url);
                }
            } catch (error) {
                console.error("Ошибка при загрузке логотипа:", error);
            }
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        onUpdate(index, newName, iconUrl, logoUrl);
    };

    return (
        <div className="flex items-center gap-2 border-[1px] border-[#B9BCCB] rounded-[10px] p-2 mt-2">
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Название дистрибутива"
                className="flex-1 bg-transparent outline-0 text-[#161616]"
            />
            <div
                className={`relative w-[50px] h-[50px] rounded-[8px] overflow-hidden bg-[#B9BCCB] cursor-pointer flex items-center justify-center ${iconUrl ? "" : "hover:bg-[#A4A8BA]"}`}
                onClick={handleIconClick}
            >
                {iconUrl ? (
                    <Image src={iconUrl} alt="Icon" fill style={{ objectFit: "cover" }} />
                ) : (
                    <UploadIcon className="w-6 h-6 text-white" />
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleIconChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <div
                className={`relative w-[50px] h-[50px] rounded-[8px] overflow-hidden bg-[#B9BCCB] cursor-pointer flex items-center justify-center ${logoUrl ? "" : "hover:bg-[#A4A8BA]"}`}
                onClick={handleLogoClick}
            >
                {logoUrl ? (
                    <Image src={logoUrl} alt="Logo" fill style={{ objectFit: "cover" }} />
                ) : (
                    <UploadIcon className="w-6 h-6 text-white" />
                )}
                <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};