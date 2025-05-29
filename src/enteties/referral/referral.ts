'use server'

import {prisma} from "../../../prisma/prisma-client";

export async function getUserReferrals(userId: number) {
    try {
        const referrals = await prisma.referral.findMany({
            where: { userId },
            select: {
                id: true,
                userId: true,
                totalReferrals: true,
                totalCashback: true,
                percent: true
            },
        });

        return referrals;
    } catch (error) {
        console.error('Error fetching referrals:', error);
        return null;
    }
}