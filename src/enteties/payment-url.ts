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
    const secretKey = "7hqyTp4r8%#2"; // MNT_INTEGRITY_CODE
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currency = "RUB";
    const subscriberId = email;
    const testMode = "0"; // Use "1" for test mode
    const resultCode = "0"; // Placeholder; replace with actual value if available
    const returnUrl = "https://loftsoft.store/successfull-payment";

    // Generate signature: resultCode + id + transactionId + MNT_INTEGRITY_CODE
    const signatureData = `${resultCode}${merchantId}${orderId}${secretKey}`;
    const signature = crypto.createHash('md5').update(signatureData).digest('hex');

    console.log("Signature Data:", signatureData);
    console.log("Signature:", signature);

    // Create payment URL
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
        MNT_CMS: "custom",
    }).toString();

    const paymentUrl = `${payAnyWayUrl}?${payAnyWayParams}`;
    return paymentUrl;
}