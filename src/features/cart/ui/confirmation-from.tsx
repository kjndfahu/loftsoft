// confirmation-from.tsx
"use client";

import { PayType } from "@/features/cart/ui/pay-type";
import { createOrder } from "@/enteties/orders/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { generatePaymentUrl } from "@/enteties/payment-url";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photo?: string;
    deviceCount?: number;
    type?: string;
    licenseType?: string;
    oldPrice?: number;
}

interface ConfirmationFromProps {
    items: OrderItem[];
    clearCart: () => void;
}

export const ConfirmationFrom = ({ items }: ConfirmationFromProps) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const sendTelegramNotification = async (email: string, items: OrderItem[]) => {
        const botToken = "7883814869:AAFUnsUtcDvfrKwhTBDfc57ljmMVDbYNMqo";
        const chatId = "-1002501960583";
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const orderDetails = items
            .map(
                (item) =>
                    `Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}, License Type: ${item.licenseType}, Device Count: ${item.deviceCount}`
            )
            .join("\n");

        const message = `New Order Received!\nEmail: ${email}\n\nOrder Details:\n${orderDetails}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });

            if (!response.ok) {
                console.error("Failed to send Telegram notification:", response.statusText);
            }
        } catch (err) {
            console.error("Error sending Telegram notification:", err);
        }
    };

    const handleOrderSubmit = async () => {
        if (!email) {
            setError("Пожалуйста, введите email");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Сначала генерируем ссылку на оплату
            const orderId = Date.now().toString(); // временный id для платежа
            const paymentUrl = await generatePaymentUrl(email, items, orderId);
            window.location.href = paymentUrl;
        } catch (err) {
            console.error("Error generating payment URL:", err);
            setError("Не удалось создать платежную ссылку");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-[20px] bg-[#F5F7FF] md:w-[368px] mds:w-[300px] w-full p-6 rounded-[15px]">
            <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#161616]" htmlFor="email">
                    Email (Придет заказ)
                </label>
                <div className="px-[15px] py-[10px] border-[1px] border-[#B9BCCB] rounded-full">
                    <input
                        className="bg-transparent w-full outline-0 text-[#161616]"
                        placeholder="Annagrill@gmail.com"
                        type="text"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
            </div>
            {items.some((item) => item.type === "SUBSCRIPTION") && (
                <div className="flex flex-col text-[12px] text-[#6A6B75] gap-[20px]">
                    <p>У вас есть подписка:</p>
                    <p>
                        Необходимо будет указать логин и пароль от аккаунта, на который нужно
                        активировать подписку. Один аккаунт не может быть использован для
                        нескольких одинаковых подписок. Подробности указаны на страницах
                        товаров.
                    </p>
                    <p>
                        Наш специалист активирует подписку в ближайшее время. При вопросах
                        обратитесь в поддержку. Спасибо за выбор нашего сервиса!
                    </p>
                </div>
            )}
            <PayType />
            <div className="flex items-start gap-[10px]">
                <input className="border-[2px] m-1 bg-[#CACDDC]" type="checkbox" />
                <p className="text-[14px] text-[#6A6B75]">
                    Ознакомлен и согласен с условиями{" "}
                    <Link href="/privacy-policy">
            <span className="font-bold text-[#161616]">
              политики конфиденциальности.
            </span>
                    </Link>
                </p>
            </div>
            <button
                className="text-[16px] py-[10px] w-full font-semibold text-white rounded-full bg-[#5069E8] disabled:bg-gray-400"
                onClick={handleOrderSubmit}
                disabled={isSubmitting || items.length === 0 || !email}
            >
                {isSubmitting ? "Обработка..." : "Перейти к оплате"}
            </button>
            {error && <div className="text-red-500 text-center text-[14px]">{error}</div>}
        </div>
    );
};