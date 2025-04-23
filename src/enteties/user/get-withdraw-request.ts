import {prisma} from "../../../prisma/prisma-client";

export async function getWithdrawRequests() {
    try {
        const withdrawRequests = await prisma.withdrawRequest.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        })

        return { success: true, data: withdrawRequests }
    } catch (error) {
        console.error("Error fetching withdraw requests:", error)
        return { success: false, error: "Не удалось получить заявки на вывод" }
    }
}