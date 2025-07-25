"use client";
import React, { FormEvent, startTransition, useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Articles } from "@prisma/client";
import Image from "next/image";
import { EditArticle } from "@/actions/EditArticles";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type EditArticleProps = {
    article: Articles;
}

const EditArticlePage: React.FC<EditArticleProps> = ({ article }) => {
    const [content, setContent] = useState(article.content ?? "Nahi mila kuch.");

    const [formState, action, isPending] = useActionState(EditArticle.bind(null, article.id), {
        errors: {},
    });


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append("content", content);

        startTransition(() => {
            action(formData);
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Article</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Article Title</Label>
                            <Input
                                className="bg-background"
                                id="title"
                                name="title"
                                defaultValue={article.title}
                                placeholder="Enter article title"
                            />
                            {formState.errors.title && (
                                <span className="font-medium text-sm text-red-500">
                                    {formState.errors.title}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={article.category}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Select Category</option>
                                <option value="technology">Technology</option>
                                <option value="programming">Programming</option>
                                <option value="bullshit">Bullshit</option>
                            </select>
                            {formState.errors.category && (
                                <span className="font-medium text-sm text-red-500">
                                    {formState.errors.category}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featuredImage">Featured Image</Label>
                            <Input
                                id="featuredImage"
                                name="featuredImage"
                                type="file"
                                accept="image/*"
                            />
                            <div className="mb-4">
                                {
                                    article.featuredImage && (
                                        <Image
                                            src={article.featuredImage ?? "Nahi mili image."}
                                            alt="Featured Image"
                                            width={300}
                                            height={150}
                                            className="rounded-md object-cover"
                                        />
                                    )}
                            </div>
                            {formState.errors.featuredImage && (
                                <span className="font-medium text-sm text-red-500">
                                    {formState.errors.featuredImage}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                            />
                            <div className="mb-4">
                            </div>
                            {formState.errors.content && (
                                <span className="font-medium text-sm text-red-500">
                                    {formState.errors.content[0]}
                                </span>
                            )}
                        </div>
                        {formState.errors.formErrors && (
                            <div className="dark:bg-transparent bg-red-100 p-2 border border-red-600">
                                <span className="font-medium text-sm text-red-500">
                                    {formState.errors.formErrors}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                            <Button disabled={isPending} type="submit">
                                {isPending ? "Loading..." : "Edit Article"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default EditArticlePage;
