"use client";

import { BarChart, FileText, LayoutDashboard, MessageCircle, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { useState } from "react";

export default function LeftSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant={"outline"} className="md:hidden m-4">
                        <LayoutDashboard className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px]">
                    <DashboardSidebar />
                </SheetContent>
            </Sheet>

            <div className="hidden md:block w-[250px] h-screen border-r bg-background">
                <DashboardSidebar />
            </div>
        </div>
    );
}

const DashboardSidebar = () => {
    return (
        <div className="h-full px-4 py-6">
            <div className="flex items-center gap-2 mb-8 px-2">
                <Link href={"/"}>
                    <span className="text-xl font-bold">RantSpace</span>
                </Link>
            </div>

            <nav>
                <Link href={"/dashboard"}>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <LayoutDashboard className="h-4 w-4 " />
                        Overview
                    </Button>
                </Link>
                <Link href={"/dashboard/articles/create"}>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <FileText className="h-4 w-4 " />
                        Articles
                    </Button>
                </Link>
                <Link href={"/dashboard"}>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <MessageCircle className="h-4 w-4 " />
                        Comments
                    </Button>
                </Link>
                <Link href={"/dashboard"}>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <BarChart className="h-4 w-4 " />
                        Analytics
                    </Button>
                </Link>
                <Link href={"/dashboard"}>
                    <Button variant={"ghost"} className="w-full justify-start">
                        <Settings className="h-4 w-4 " />
                        Settings
                    </Button>
                </Link>
            </nav>
        </div>
    )
}
