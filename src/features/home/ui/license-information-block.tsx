"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export const LicenseInformationBlock = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="flex flex-col items-center gap-5 max-w-[700px] mx-auto">
            <h1 className="font-medium mds:text-[40px] sm:text-[27px] text-[20px] text-center mds:leading-[55px] sm:leading-[32px] leading-[24px] text-[#161616]">
                Интернет-магазин лицензионного программного обеспечения
            </h1>

            <div className="relative">
                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? "auto" : "120px"
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="overflow-hidden"
                >
                    <div
                        className="text-left text-[#6A6B75] mds:text-[16px] text-[14px] sm:w-[420px] s:w-[330px] w-[310px]">
                        <p className="mb-4">
                            Лицензия открывает все возможности программы, будь то операционная система Windows, MS
                            Office или антивирус.
                            Считаете, что активация слишком дорога? Интернет-магазин Keysoft предлагает лицензии и ключи
                            активации по
                            низким ценам. Обеспечьте безопасность данных, паролей и средств, используя только
                            лицензионные версии программ. Мы
                            сотрудничаем с Microsoft, Dr.Web, Kaspersky и другими, предлагая ключи на Windows, MS
                            Office, Photoshop,
                            антивирусы и другие программы. Гарантия на весь товар. А также имеется реферальная система.
                        </p>
                    </div>
                </motion.div>

                {/* Градиентная маска для плавного затухания текста в свернутом состоянии */}
                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.2}}
                            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center self-start transition duration-200 gap-2 mx-auto mt-4 text-black font-medium hover:text-gray-700"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                >
                    <motion.div
                        animate={{rotate: isExpanded ? 180 : 0}}
                        transition={{duration: 0.3}}
                    >
                        <ChevronDown size={20}/>
                    </motion.div>
                    <span>{isExpanded ? "Свернуть" : "Читать полностью"}</span>
                </motion.button>
            </div>
        </div>
    )
}
