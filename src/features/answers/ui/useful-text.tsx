import {Lamp} from "@/shared/icons";

export const UsefulText = () => {
    return (
        <>
            <h4 className="flex items-center gap-4 w-full border-b-[1px] border-[#DBDEEF] pb-6 font-semibold md:text-[24px] text-[18px] text-[#161616] mb-4">
                <Lamp className="w-[29px] h-[37px]"/>
                Совершение покупки
            </h4>
            <div className="space-y-4">
                <div>
                    <h5 className="font-semibold md:text-[20px] text-[16px] text-[#161616]">
                        Как оформить заказ на сайте?
                    </h5>
                    <ul className="list-disc list-inside md:text-[14px] text-[12px] text-[#666666] ml-4">
                        <li>
                            Выберите понравившийся товар и нажмите кнопку "Добавить в корзину".
                        </li>
                        <li>
                            Перейдите в корзину и нажмите кнопку "Оформить заказ".
                        </li>
                        <li>
                            Укажите свои данные для доставки и выберите удобный способ оплаты.
                        </li>
                        <li>
                            Подтвердите заказ и дождитесь уведомления об его статусе.
                        </li>
                        <li>
                            Ознакомьтесь с условиями доставки и оплаты, и получите заказ в
                            указанное время.
                        </li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-semibold md:text-[20px] text-[16px] text-[#161616]">
                        Как оформить заказ через мобильное приложение?
                    </h5>
                    <ul className="list-disc list-inside md:text-[14px] text-[12px] text-[#666666] ml-4">
                        <li>
                            Откройте мобильное приложение и выберите понравившийся продукт.
                        </li>
                        <li>
                            Добавьте товар в корзину и перейдите к оформлению заказа.
                        </li>
                        <li>
                            Введите данные для доставки и выберите способ оплаты.
                        </li>
                        <li>
                            Подтвердите заказ и дождитесь уведомления о статусе заказа.
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}