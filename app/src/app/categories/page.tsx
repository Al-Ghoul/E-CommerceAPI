"use client";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Categories } from "@/components/ui/categories/categories";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Category } from "@/db.d";

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const fetchCategories = (q: string) =>
    fetch(`/api/categories/search?q=${q}`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const { data, isError, error, isFetching } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => fetchCategories(query),
    enabled: query.length > 0,
  });

  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{
        opacity: 0,
        x: -50,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 0,
        duration: 0.7,
      }}
    >
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Browse Our Categories
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Explore our wide range of product categories to find exactly
                what you&apos;re looking for.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Search categories..."
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {isFetching ? (
                    <div className="absolute right-14 top-2 w-6 h-6 rounded-full animate-spin border-y-4 border-solid border-blue-500 border-t-transparent shadow-md"></div>
                  ) : null}

                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>

                {isError ? (
                  <div className="absolute mt-2 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="text-red-500 text-center">
                      <p>Error: {error.message}</p>
                    </div>
                  </div>
                ) : null}

                {data?.data?.length > 0 && (
                  <div className="absolute mt-2 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {data.data.map((result: Category) => (
                      <Link
                        href={`/categories/${result.id}/products`}
                        // @ts-expect-error the id will be a string
                        key={result.id}
                        className="hover:bg-gray-200"
                      >
                        {result.name}
                        <span className="block text-sm text-gray-500">
                          {result.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Categories />
    </motion.div>
  );
}
