"use server"

import { PrismaClient, RequestStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
// import { getUserFromSession } from "@/lib/auth" // You'll need to implement this function

const prisma = new PrismaClient()

interface SoftRequestFormData {
    name: string
    email: string
    program: string
    comment: string
    privacyPolicy: boolean
}

interface SoftRequestResult {
    success: boolean
    error?: string
}

export async function createSoftRequest(formData: SoftRequestFormData): Promise<SoftRequestResult> {
    try {
        // Check if user is logged in
        const currentUser = await getUserFromSession()

        // Create the soft request in the database with all form fields
        await prisma.softRequests.create({
            data: {
                name: formData.name,
                email: formData.email,
                program: formData.program,
                comment: formData.comment || "",
                status: RequestStatus.PENDING,
                // If user is logged in, associate the request with their account
                ...(currentUser ? { user: { connect: { id: currentUser.id } } } : {}),
            },
        })

        revalidatePath("/requests")
        return { success: true }
    } catch (error) {
        console.error("Error creating soft request:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Произошла ошибка при создании запроса",
        }
    }
}

export async function getSoftRequests() {
    try {
        const softRequests = await prisma.softRequests.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

        return { success: true, data: softRequests }
    } catch (error) {
        console.error("Error fetching soft requests:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Ошибка при получении заявок",
        }
    }
}

// This is a placeholder function - you'll need to implement your own auth logic
async function getUserFromSession() {
    try {
        // Get session token from cookies
        const sessionToken = cookies().get("session")?.value

        if (!sessionToken) {
            return null
        }

        // Find user by session token
        // This is just an example - implement according to your auth system
        const user = await prisma.user.findFirst({
            where: {
                // This is a placeholder - replace with your actual session logic
                email: sessionToken, // This is not a real implementation
            },
        })

        return user
    } catch (error) {
        console.error("Error getting user from session:", error)
        return null
    }
}
