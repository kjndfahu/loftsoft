import FaqAccordion from "@/features/about-us/ui/faq-accordion";

export const FaqBlock = () => {
    return (
        <div className="flex sml:gap-0 gap-4 sml:flex-row flex-col justify-between">
            <h1 className="mds:text-[34px] sml:text-[28px] text-[22px] mds:leading-[42px] sml:leading-[32px] leading-6 text-[#161616] font-semibold">Ответы<br/> на вопросы</h1>
            <FaqAccordion/>
        </div>
    )
}