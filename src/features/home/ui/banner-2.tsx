'use client'

import { useState } from "react";
import Link from "next/link";

export const Banner2 = () => {
    const banners = [
        {
            background: 'bg-banner2',
            title: "Adobe Creative Cloude 2024",
            description: "20+ креативных предложений Бесконечные возможности",
            descWidth: '280px',
            stats: "3k+",
            statsDescription: "Продаем больше, чем конкуренты. Без лишних компонентов"
        },
        {
            background: 'bg-banner3',
            title: "Ableton Live",
            description: "Музыка без границ — твори, записывай, управляй звуком",
            descWidth: '230px',
            stats: "3k+",
            statsDescription: "Продаем больше, чем конкуренты. Без лишних компонентов"
        },
        {
            background: 'bg-banner4',
            title: "Jetbrains All pack",
            description: "Идеальные инструменты для кода — ускорь разработку на максимум",
            descWidth: '200px',
            stats: "3k+",
            statsDescription: "Продаем больше, чем конкуренты. Без лишних компонентов"
        },
        {
            background: 'bg-banner5',
            title: "Autodesk pack 2023-2026",
            description: "Проектируй будущее — мощь профессионального 3D и CAD",
            descWidth: '250px',
            stats: "3k+",
            statsDescription: "Продаем больше, чем конкуренты. Без лишних компонентов"
        }
    ];

    const [currentBanner, setCurrentBanner] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handlePrev = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
            setIsTransitioning(false);
        }, 100); // Match the transition duration
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
            setIsTransitioning(false);
        }, 100); // Match the transition duration
    };

    const handleDotClick = (index: number) => {
        if (index !== currentBanner) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentBanner(index);
                setIsTransitioning(false);
            }, 100); // Match the transition duration
        }
    };

    const { background, title, description, descWidth, stats, statsDescription } = banners[currentBanner];

    return (
        <div className="relative w-full mds:w-1/2 rounded-[20px] overflow-hidden">
            <div
                className={`absolute inset-0 ${background} bg-cover bg-no-repeat sm:bg-[position:0px] transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
            />
            <div
                className="relative flex flex-col cursor-pointer gap-4 mds:p-10 p-6 sm:h-[536px] h-[240px] rounded-[20px]"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < rect.width / 2) handlePrev();
                    else handleNext();
                }}
            >
                <h2 className="text-[#424141] md:text-[34px] text-[24px] md:leading-[40px] leading-[28px] font-semibold">
                    {title.split(" ").map((word, index) => (
                        <span key={index}>
                            {word}
                            {index < title.split(" ").length - 1 && " "}
                            {index === 1 && <br />}
                        </span>
                    ))}
                </h2>
                <p className={`md:text-[16px] w-[${descWidth}] text-[14px] md:leading-6 leading-4 text-[#343434]`}>
                    {description.split(". ").map((sentence, index) => (
                        <span key={index}>
                            {sentence}
                        </span>
                    ))}
                </p>
                <div className="flex gap-[10px]">
                    <Link href="/catalog">
                        <button
                            className="md:text-[16px] text-[14px] md:leading-6 leading-4 w-[91px] h-[42px] font-semibold bg-[#5069E8] rounded-full text-white">
                            Купить
                        </button>
                    </Link>
                </div>

                <div className="absolute sm:flex hidden items-end justify-end w-[237px] h-[241px] right-0 bottom-0 bg-white rounded-tl-[22px]">
                    <div className="flex flex-col text-white items-center justify-between p-5 rounded-[20px] w-[217px] h-[221px] bg-[linear-gradient(126.44deg,_#516DEB_-1.33%,_#D6DDFF_100%)]">
                        <p className="font-medium text-[14px]">{statsDescription}</p>
                        <h3 className="self-start font-semibold leading-[50px] text-[50px]">{stats}</h3>
                    </div>
                </div>

                <div className="absolute sm:bottom-4 bottom-[-10px] mdbvp:left-[150px] sm:left-[100px] left-1/2 transform -translate-x-1/2 md:flex mds:hidden flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDotClick(index);
                            }}
                            className={`mdbvp:w-[47px] w-[30px] h-1 border-[#FFFFFF40] rounded-full ${
                                index === currentBanner ? "sm:bg-[#ffffff] bg-[#5F78EE]" : "sm:bg-[#FFFFFF40] bg-[#5F78EE26]"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};