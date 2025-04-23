import {AnimatePresence, motion} from "framer-motion";
import {FC} from "react";

interface Props{
    isOpen:boolean;
    setIsOpen:(isOpen:boolean) => void;
    categories: {
        id: number;
        photo: string;
        title: string;
        description: string;
        createdAt: Date;
        updateAt: Date;
    }[];
}

export const SearchResults:FC<Props> =  ({isOpen, setIsOpen, categories}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed top-[125px] inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg z-50 py-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 text-black">
                            <h3 className="font-bold text-[18px] mb-2">Категории</h3>
                            <div className="mb-4">
                                {categories.map((category) => (
                                    <p key={category.id} className="py-2 hover:bg-gray-50 text-[16px] font-medium cursor-pointer">{category.title}</p>
                                ))}
                            </div>

                            <h3 className="font-bold text-[18px] mb-2">Товары</h3>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex items-center gap-2 py-2 hover:bg-gray-50 cursor-pointer">
                                        <div className="w-6 h-6 bg-blue-500 rounded-sm flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm">Windows 11</p>
                                            <p className="text-xs text-gray-500">Майкрософт</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}