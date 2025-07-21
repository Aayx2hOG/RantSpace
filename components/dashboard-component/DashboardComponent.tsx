import Link from "next/link";
import { Button } from "../ui/button";
import { Clock, FileText, MessageCircle, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { prismaClient } from "@/prisma";
import RecentArticles from "@/components/dashboard-component/RecentArticles";

export default async function DashboardComponent() {

    const [articles, totalComments] = await Promise.all([
        prismaClient.articles.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                comments: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                        imageUrl: true,
                    }
                }
            },
        }),
        prismaClient.comment.count(),
    ])

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your content and Analytics
                    </p>
                </div>

                <Link href={"/dashboard/articles/create"}>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Article
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 mb-8 gap-4">
                <Card className="bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium">Total Articles</CardTitle>
                        <FileText className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{articles.length}</div>
                        <p className="text-sm text-muted-foreground">+5 from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium">Total Comments</CardTitle>
                        <MessageCircle className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalComments}</div>
                        <p className="text-sm text-muted-foreground">+12 awaiting moderation</p>
                    </CardContent>
                </Card>

                <Card className="bg-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium">Avg. Rating Time</CardTitle>
                        <Clock className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4.2</div>
                        <p className="text-sm text-muted-foreground">+0.6 from last month </p>
                    </CardContent>
                </Card>
            </div>

            <RecentArticles articles={articles} />

        </main >
    )
}
