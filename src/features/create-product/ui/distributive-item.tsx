// /src/features/create-product/ui/distributive-item.tsx
import { FC } from "react";
import { X } from "lucide-react";

interface DistributiveDetailsProps {
    index: number;
    displayName: string;
    fileUrl: string;
    onUpdate: (index: number, displayName: string) => void;
    onRemove: (index: number) => void;
}

export const DistributiveDetails: FC<DistributiveDetailsProps> = ({
                                                                      index,
                                                                      displayName,
                                                                      fileUrl,
                                                                      onUpdate,
                                                                      onRemove,
                                                                  }) => {
    return (
        <div className="flex flex-col gap-2 p-[10px] border-[1px] border-[#E9EBF6] rounded-[10px]">
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => onUpdate(index, e.target.value)}
                    placeholder="Название дистрибутива"
                    className="px-3 py-1 border-[1px] border-[#B9BCCB] rounded-[10px] w-full"
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-[#161616]"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <p className="text-[12px] text-[#333438] break-all">{fileUrl}</p>
        </div>
    );
}