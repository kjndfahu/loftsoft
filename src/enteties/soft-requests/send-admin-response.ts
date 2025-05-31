'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendAdminResponseState = {
    formData?: FormData;
    errors?: {
        _errors?: string;
    };
    success?: boolean;
};

export async function sendAdminResponseEmail(
    state: SendAdminResponseState,
    formData: FormData
): Promise<SendAdminResponseState> {
    try {
        const email = formData.get('email')?.toString();
        const adminResponse = formData.get('response')?.toString();
        const requestId = formData.get('requestId')?.toString();
        const mainMail = 'admin@loftsoft.store';

        if (!email) {
            return {
                formData,
                errors: {
                    _errors: "Требуется адрес электронной почты получателя"
                }
            };
        }

        if (!adminResponse) {
            return {
                formData,
                errors: {
                    _errors: "Требуется ответ администратора"
                }
            };
        }

        if (!requestId) {
            return {
                formData,
                errors: {
                    _errors: "Требуется идентификатор заявки"
                }
            };
        }

        await resend.emails.send({
            from: mainMail,
            to: email,
            subject: `Ответ на вашу заявку #${requestId}`,
            html: `
                <!DOCTYPE html>
                <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ответ на вашу заявку #${requestId}</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="background-color: #005B8B; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Ответ на вашу заявку #${requestId}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px;">
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 15px;">Уважаемый пользователь,</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 15px;">Благодарим вас за вашу заявку. Мы внимательно рассмотрели ваш запрос, и вот наш ответ:</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 15px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #005B8B;">${adminResponse}</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 15px;">Если у вас есть дополнительные вопросы, пожалуйста, свяжитесь с нами по адресу <a href="mailto:admin@loftsoft.store" style="color: #005B8B; text-decoration: none;">admin@loftsoft.store</a>.</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">С уважением,</p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">Команда LoftSoft</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f4f4f4; padding: 10px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <p style="color: #666666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} LoftSoft. Все права защищены.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });

        return {
            formData,
            success: true
        };

    } catch (error) {
        console.error("Ошибка при отправке ответа администратора:", error);
        return {
            formData,
            errors: {
                _errors: error instanceof Error ? error.message : "Не удалось отправить ответ администратора"
            }
        };
    }
}