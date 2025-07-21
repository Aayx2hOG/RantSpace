"use client";

import { Search } from "lucide-react";
import { useParams } from "next/navigation"
import { Input } from "../ui/input";

export const SearchInput = () => {

    const parms = useParams();

    return (
        <form action="">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search articles..."
                    className="pl-10 w-48 focus-visible:ring-1"
                />
            </div>
        </form>
    )
}
