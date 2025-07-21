"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import z from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prismaClient } from "@/prisma";
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const createArticleSchema = z.object({
    title: z.string()
        .min(3, { message: "Title must be at least 3 characters long." })
        .max(100, { message: "Title must be less than 100 characters." }),

    category: z.string()
        .min(3, { message: "Please select a valid category." })
        .max(50, { message: "Category name is too long." }),

    content: z.string().refine((val) => {
        const stripped = val.replace(/<[^>]*>?/gm, "").trim();
        return stripped.length > 0;
    }, {
        message: "Content cannot be empty.",
    }),
});

type createArticleFormState = {
    errors: {
        title?: string[];
        category?: string[];
        featuredImage?: string[];
        content?: string[];
        formErrors?: string[];
    }
}

export const CreateArticle = async (prevstate: createArticleFormState, formData: FormData): Promise<createArticleFormState> => {
    const result = createArticleSchema.safeParse({
        title: formData.get("title"),
        category: formData.get("category"),
        content: formData.get("content"),
    })

    if (!result.success) {
        const formatted = result.error.format();
        return {
            errors: {
                title: formatted.title?._errors,
                category: formatted.category?._errors,
                content: formatted.content?._errors,
            }
        }
    }

    const { userId } = await auth();
    if (!userId) {
        return {
            errors: {
                formErrors: ["You must be logged in to create an article"]
            }
        }
    }

    const existingUser = await prismaClient.user.findUnique({
        where: {
            clerkUserId: userId
        }
    });
    if (!existingUser) {
        return {
            errors: {
                formErrors: ["User not found. Please log in again."]
            }
        }
    }

    const imageFile = formData.get("featuredImage") as File | null;
    if (!imageFile || imageFile.name === "undefined") {
        return {
            errors: {
                featuredImage: ["Please upload a valid image file."]
            }
        }
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResponse: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });

    const imageUrl = uploadResponse?.secure_url;

    if (!imageUrl) {
        return {
            errors: {
                featuredImage: ["Failed to upload image. Please try again."]
            }
        }
    }

    try {
        await prismaClient.articles.create({
            data: {
                title: result.data.title,
                category: result.data.category,
                content: result.data.content,
                featuredImage: imageUrl,
                authorId: existingUser.id,
            }
        })
    } catch (e) {
        if (e instanceof Error) {
            return {
                errors: {
                    formErrors: [e.message]
                }
            }
        } else {
            return {
                errors: {
                    formErrors: ["An unexpected error occurred. Please try again."]
                }
            }
        }
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
