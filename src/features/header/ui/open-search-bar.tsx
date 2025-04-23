import { motion } from "framer-motion"
import {CatalogBar} from "@/features/header/ui/catalog-bar";

export const OpenSearchBar = () => {
    const slideVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            y: 0,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    }

    return (
        <motion.div
            className="absolute top-full w-[1450px] h-[357px] left-[-300px] bg-white rounded-b-lg shadow-lg mt-1 z-50 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
        >
            <div className="flex p-8">
                <CatalogBar/>
                <div className="flex flex-col gap-6 py-2 px-8">
                    <h2 className="text-[#161616] text-[27px] font-medium">Майкрософт</h2>
                    <div className="flex gap-[144px]">
                        <div className="flex flex-col gap-4">
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 11</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 10</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2025</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2019</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2012</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Microsoft SQL Server</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 8</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 7</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2022</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2016</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server RDS</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 8</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows 7</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2022</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server 2016</p>
                            <p className="text-[16px] text-[#4E4F56] cursor-pointer font-medium">Windows Server RDS</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
