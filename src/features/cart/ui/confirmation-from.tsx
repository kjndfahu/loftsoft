import {PayType} from "@/features/cart/ui/pay-type";

export const ConfirmationFrom = () => {
    return (
        <div className="flex flex-col gap-[20px] bg-[#F5F7FF] w-[368px] p-6 rounded-[15px]">
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#161616]" htmlFor="">Email (Придет заказ)</label>
                <div className="px-[15px] py-[10px] border-[1px] border-[#B9BCCB] rounded-full">
                    <input className="bg-transparent outline-0 text-[#161616]" placeholder="Annagrill@gmail.com"
                           type="text"/>
                </div>
            </div>
            <div className="flex flex-col text-[12px] text-[#6A6B75] gap-[20px]">
                <p>У вас есть подписка:</p>
                <p>Необходимо будет указать логин и пароль от аккаунта, на который нужно активировать подписку.
                    Один аккаунт не может быть использован для нескольких одинаковых подписок. Подробности указаны на страницах товаров.</p>
                <p>Наш специалист активирует подписку в ближайшее время. При вопросах обратитесь в поддержку. Спасибо за выбор нашего сервиса!</p>
            </div>
            <PayType/>
            <div className="flex items-start gap-[10px]">
                <input className="border-[2px] m-1 bg-[#CACDDC]" type="checkbox"/>
                <p className="text-[14px] text-[#6A6B75]">Ознакомлен и согласен с условиями <span className="font-bold text-[#161616]">политики конфиденциальности.</span></p>
            </div>
            <button className="text-[16px] py-[10px] font-semibold text-white rounded-full bg-[#5069E8]">
                Перейти к оплате
            </button>
        </div>
    )
}