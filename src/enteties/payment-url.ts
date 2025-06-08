"use server";

import crypto from 'crypto';

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

export async function generatePaymentUrl(email: string, items: OrderItem[], orderId: string) {
    const merchantId = "10338738";
    const secretKey = "7hqyTp4r8%#2"; // Замените на актуальный secretKey, например, "12345" из вашего примера
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currency = "RUB";
    const subscriberId = email;
    const testMode = "0";
    const returnUrl = "https://loftsoft.store/successfull-payment";
    const paymentSystemUnitId = "2";
    const paymentSystemLimitIds = "0";

    // Формируем строку для подписи: MNT_ID + MNT_TRANSACTION_ID + MNT_AMOUNT + MNT_CURRENCY_CODE + MNT_SUBSCRIBER_ID + MNT_TEST_MODE + secretKey
    const signatureData = `${merchantId}${orderId}${amount.toFixed(2)}${currency}${subscriberId}${testMode}${secretKey}`;

    console.log("Signature Data:", signatureData);

    const payAnyWayUrl = "https://payanyway.ru/assistant.htm";
    const payAnyWayParams = new URLSearchParams({
        MNT_ID: merchantId,
        MNT_TRANSACTION_ID: orderId,
        MNT_AMOUNT: amount.toFixed(2),
        MNT_CURRENCY_CODE: currency,
        MNT_TEST_MODE: testMode,
        MNT_SIGNATURE: signatureData,
        MNT_SUCCESS_URL: returnUrl,
        MNT_FAIL_URL: returnUrl,
        MNT_DESCRIPTION: `Order #${orderId} from ${email}`,
        MNT_SUBSCRIBER_ID: subscriberId
    }).toString();

    const paymentUrl = `${payAnyWayUrl}?${payAnyWayParams}`;
    return paymentUrl;
}