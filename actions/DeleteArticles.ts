"use server";

import { prismaClient } from "@/prisma";
import { revalidatePath } from "next/cache";

export const DeleteArticle = async (articleId: string) => {
    await prismaClient.articles.delete({
        where: { id: articleId },
    });
    revalidatePath("/dashboard");
}
