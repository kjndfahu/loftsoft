"use client"

import type React from "react"

export const RestorePasswordInputs = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#A4A8BA]" htmlFor="email">
                    Email
                </label>
                <div
                    className="flex items-center justify-between rounded-full border-[1px] border-[#B9BCCB] px-[15px] py-[10px]"
                >
                    <input
                        id="email"
                        name="email"
                        placeholder=""
                        className="text-[14px] text-[#161616] outline-0 w-full"
                        type="string"
                    />
                </div>
            </div>
        </div>
    )
}
