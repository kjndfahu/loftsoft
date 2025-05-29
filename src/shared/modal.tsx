'use client'
import {ReactNode, useEffect, useState} from "react";

interface Props {
    form: ReactNode
    isOpen?: boolean
    onClose?: () => void
    autoClose?: number
}

export const Modal:React.FC<Props> = ({ form, isOpen = true, onClose, autoClose }) =>{
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
        <div className="flex z-[100] items-center justify-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex sm:items-center items-end justify-center relative w-full h-full "
                onClick={e => e.stopPropagation()}>
                {form}
            </div>
        </div>
    )
}