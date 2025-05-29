"use client"

import { toast, type Toast as HotToast, type ToastPosition, Toaster, type Renderable } from "react-hot-toast"
import {ErrorLogo, SuccessLogo} from "@/shared/icons";

interface Toast extends HotToast {
    message: string;
    secondaryMessage?: string;
}

export type ToastType = "success" | "error"

interface CustomToastOptions {
    position?: ToastPosition
    duration?: number
    className?: string
    secondaryMessage?: string
}

const defaultOptions: CustomToastOptions = {
    position: "top-center",
    duration: 3000,
}

const CustomToast = ({ toast, type }: { toast: Toast; type: ToastType }) => {
    const styles = {
        success: "bg-[#ffffff] shadow-2xl text-[#161616]",
        error: "bg-[#ffffff] shadow-2xl text-[#161616]",
    }

    const iconStyles = {
        success: "bg-[#98D758] text-white",
        error: "bg-[#FF5757] text-white",
    }

    const className = `flex items-center w-[496px] px-4 py-3 rounded-2xl border shadow-lg ${styles[type]} ${toast.className || ""}`

    return (
        <div className={className.trim()}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${iconStyles[type]}`}>
                {type === "success" ? (
                   <SuccessLogo/>
                ) : (
                    <ErrorLogo/>
                )}
            </div>

            <div className="ml-3 flex-1">
                <span className="font-medium text-[#161616]">{toast.message}</span>
                {toast.secondaryMessage && (
                    <p className="text-[12px] font-medium text-[#A4A8BA]">{toast.secondaryMessage}</p>
                )}
            </div>


            <button
                className="ml-3 text-gray-400 hover:text-gray-200 focus:outline-none"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export const showToast = (message: string, type: ToastType, options?: CustomToastOptions) => {
    const mergedOptions = { ...defaultOptions, ...options }

    return toast.custom(
        (t: HotToast): Renderable => <CustomToast toast={{ ...t, message, secondaryMessage: options?.secondaryMessage }} type={type} />,
        {
            duration: mergedOptions.duration,
            position: mergedOptions.position,
            className: mergedOptions.className,
        }
    )
}

export const ToastContainer = () => {
    return (
        <Toaster
            containerStyle={{
                top: 20,
                left: 20,
                right: 20,
            }}
            toastOptions={{
                duration: 3000,
            }}
        />
    )
}