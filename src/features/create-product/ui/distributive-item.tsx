// /src/features/create-product/ui/distributive-item.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";

interface DistributiveDetailsProps {
    index: number;
    displayName: string;
    fileUrl: string;
    logoUrl?: string;
    onUpdate: (index: number, displayName: string, iconUrl?: string, logoUrl?: string) => void;
    onRemove: (index: number) => void;
}

export const DistributiveDetails: React.FC<DistributiveDetailsProps> = ({ index, displayName, fileUrl, logoUrl, onUpdate, onRemove }) => {
    const [customName, setCustomName] = useState(displayName);
    const [iconUrl, setIconUrl] = useState("");
    const [newLogoUrl, setNewLogoUrl] = useState(logoUrl || "");

    const handleUpdate = () => {
        onUpdate(index, customName, iconUrl || undefined, newLogoUrl || undefined);
    };

    return (
        <div className="mt-2 p-3 border-[1px] border-[#B9BCCB] rounded-[10px]">
            <div className="flex items-center justify-between">
                <h5 className="text-[14px] font-semibold text-[#161616]">Детали дистрибутива</h5>
                <button type="button" onClick={() => onRemove(index)} className="text-[#161616]">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="mt-2 space-y-2">
                <input
                    type="text"
                    placeholder="Название дистрибутива"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onBlur={handleUpdate}
                    className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px]"
                />
                <input
                    type="text"
                    placeholder="URL иконки (необязательно)"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    onBlur={handleUpdate}
                    className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px]"
                />
                <input
                    type="text"
                    placeholder="URL логотипа (необязательно)"
                    value={newLogoUrl}
                    onChange={(e) => setNewLogoUrl(e.target.value)}
                    onBlur={handleUpdate}
                    className="w-full px-3 py-2 border-[1px] border-[#B9BCCB] rounded-[10px]"
                />
                <div className="text-[12px] text-[#161616] truncate">Файл: {fileUrl}</div>
            </div>
        </div>
    );
};