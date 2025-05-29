"use client"

import loader from '../../public/img/loader.png'
import Image from 'next/image'

export const Loader = ({ className = "" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image alt="loader" src={loader} className={`animate-spin text-white`}/>
        </div>
    )
}