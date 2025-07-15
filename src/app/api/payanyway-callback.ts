import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { MNT_TRANSACTION_ID, MNT_RESULT_CODE, MNT_SIGNATURE } = body;

    // TODO: добавить проверку подписи MNT_SIGNATURE для безопасности

    if (MNT_RESULT_CODE === '200') {
      const orderId = parseInt(MNT_TRANSACTION_ID, 10);
      if (isNaN(orderId)) {
        return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
      }
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
      });
      return NextResponse.json({ result: 'OK' });
    }
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 