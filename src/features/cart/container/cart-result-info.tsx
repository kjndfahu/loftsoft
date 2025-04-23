import {SumBlock} from "@/features/cart/ui/sum-block";
import {ConfirmationFrom} from "@/features/cart/ui/confirmation-from";
import {BankType} from "@/features/cart/ui/bank-type";
import {Mastercard, Mir, Sberbank, SBPBank, Visa} from "@/shared/bank-types-icons";

export const CartResultInfo = () => {
    return (
        <div className="flex flex-col gap-3 w-[368px]">
            <SumBlock/>
            <ConfirmationFrom/>
            <div className="flex items-center justify-center gap-4">
                <BankType className="bg-[#F1FFFB]" logo={<SBPBank/>}/>
                <BankType className="bg-[#EFF2FF]" logo={<Visa/>}/>
                <BankType className="bg-[#FAFAFA]" logo={<Mastercard/>}/>
                <BankType className="bg-[#F1FFFB]" logo={<Mir/>}/>
                <BankType className="bg-[#F1FFFB]" logo={<Sberbank/>}/>
            </div>
        </div>
    )
}