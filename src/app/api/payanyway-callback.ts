import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { MNT_TRANSACTION_ID, MNT_RESULT_CODE, MNT_SIGNATURE, email, items } = body;

    // TODO: добавить проверку подписи MNT_SIGNATURE для безопасности

    if (MNT_RESULT_CODE === '200') {
      const orderId = parseInt(MNT_TRANSACTION_ID, 10);
      if (isNaN(orderId)) {
        return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
      }

      // Проверяем, есть ли уже заказ с таким id
      const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (!existingOrder) {
        // Создаём заказ со статусом PENDING
        await prisma.order.create({
          data: {
            id: orderId,
            email: email || '',
            totalAmount: Array.isArray(items) ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0,
            status: 'PENDING',
            orderItems: {
              create: Array.isArray(items)
                ? items.map((item: any) => ({
                    itemId: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price,
                    oldPrice: item.oldPrice || null,
                    type: item.type || '',
                    licenseType: item.licenseType || '',
                    deviceCount: item.deviceCount || 1,
                  }))
                : [],
            },
          },
        });
      }
      return NextResponse.json({ result: 'OK' });
    }
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 