"use client";

import Link from "next/link";
import { Prisma } from "@prisma/client";
import { useTransition } from "react";
import { DeleteArticle } from "@/actions/DeleteArticles";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type RecentArticlesProps = {
    articles: Prisma.ArticlesGetPayload<{
        include: {
            comments: true,
            author: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true,
                }
            }
        }
    }>[]
}

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
    return (
        <Card className="mb-8 bg-background">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Recent Articles</CardTitle>
                    <Button className="text-muted-foreground" size={"sm"} variant={"ghost"}>View All →</Button>
                </div>
            </CardHeader>
            {!articles.length ? (<CardContent >No articles found.</CardContent>)
                : (<CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {articles.slice(0, 5).map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                            Published
                                        </span>
                                    </TableCell>
                                    <TableCell>{article.comments.length}</TableCell>
                                    <TableCell>{new Date(article.createdAt).toDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={`/dashboard/articles/${article.id}/edit`}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            <DeleteButton articleId={article.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                )
            }
        </Card>
    )
}
export default RecentArticles;

type DeleteButtonProps = {
    articleId: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ articleId }) => {
    const [isPending, startTransition] = useTransition();
    return (
        <form action={() => {
            startTransition(async () => {
                await DeleteArticle(articleId);
            });
        }}>
            <Button disabled={isPending} variant={"ghost"} size={"sm"}>
                {isPending ? "Deleting..." : "Delete"}
            </Button>
        </form>
    )
}
