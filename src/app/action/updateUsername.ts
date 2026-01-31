"use server"
import { auth } from "@/auth"
import { UpdateProfileValidation } from "../components/schema/validation"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateProfile (formData: FormData){
try{
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" };

    const data = { 
        username: formData.get("username")?.toString() || "",
        image: formData.get("image")?.toString() || ""
    }
    const profileParsed = UpdateProfileValidation.safeParse(data)

    if (!profileParsed.success) {
        return {
            error: profileParsed.error.flatten().fieldErrors
        }
    }

    await prisma.user.update({
        where: {id: session.user.id},
        data: {
            username: profileParsed.data.username,
            image: profileParsed.data.image || null
        }
    })
    revalidatePath ("/dashboard")

    return { success: true }
} catch (error) {
    console.error("Updating username failed!!", error)
    return  {
        error: { username: ["Failed to update username. Please try again."] }
    }
}
}