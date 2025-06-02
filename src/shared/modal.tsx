'use client'
import {ReactNode, useEffect, useState} from "react";

interface Props {
    form: ReactNode
    isOpen?: boolean
    onClose?: () => void
    autoClose?: number
    setModalOpen: (arg: boolean) => void
}

export const Modal:React.FC<Props> = ({ form, isOpen = true, onClose, autoClose, setModalOpen }) =>{
    const [isVisible, setIsVisible] = useState(isOpen)

    useEffect(() => {
        setIsVisible(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (autoClose && isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false)
                if (onClose) onClose()
            }, autoClose)

            return () => clearTimeout(timer)
        }
    }, [autoClose, isVisible, onClose])

    return (
        <div onClick={() => setModalOpen(false)} className="flex z-[102] items-center justify-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex sm:items-center items-end justify-center relative w-full h-full "
                >
                {form}
            </div>
        </div>
    )
}