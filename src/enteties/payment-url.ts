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
    const secretKey = "7hqyTp4r8%#2";
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currency = "RUB";
    const subscriberId = email;
    const testMode = "0";
    const returnUrl = "https://loftsoft.store/successfull-payment";
    const paymentSystemUnitId = "2";
    const paymentSystemLimitIds = "0";

    const signatureData = `${merchantId}${orderId}${amount.toFixed(2)}${currency}${subscriberId}${testMode}${secretKey}`;
    const signature = crypto.createHash('md5').update(signatureData).digest('hex');

    console.log("Signature Data:", signatureData);
    console.log("Signature:", signature);

    const payAnyWayUrl = "https://payanyway.ru/assistant.htm";
    const payAnyWayParams = new URLSearchParams({
        MNT_ID: merchantId,
        MNT_TRANSACTION_ID: orderId,
        MNT_AMOUNT: amount.toFixed(2),
        MNT_CURRENCY_CODE: currency,
        MNT_TEST_MODE: testMode,
        MNT_SIGNATURE: signature,
        MNT_SUCCESS_URL: returnUrl,
        MNT_FAIL_URL: returnUrl,
        MNT_DESCRIPTION: `Order #${orderId} from ${email}`,
        MNT_SUBSCRIBER_ID: subscriberId,
        'paymentSystem.unitId': paymentSystemUnitId,
        'paymentSystem.limitIds': paymentSystemLimitIds,
    }).toString();

    const paymentUrl = `${payAnyWayUrl}?${payAnyWayParams}`;
    return paymentUrl;
}