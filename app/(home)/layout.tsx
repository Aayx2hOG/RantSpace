import { Navbar } from "@/components/header/Navbar";
import { prismaClient } from "@/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function layout({ children }: { children: React.ReactNode }) {

    const user = await currentUser();
    if (!user) {
        return null;
    }
    const loggedInUser = await prismaClient.user.findUnique({
        where: { clerkUserId: user.id },
    });
    if (!loggedInUser) {
        await prismaClient.user.create({
            data: {
                name: `${user.fullName} ${user.lastName}`,
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            },
        });
    }
    return (
        <div>
            <Navbar />
            {children}
        </div >
    );
};
