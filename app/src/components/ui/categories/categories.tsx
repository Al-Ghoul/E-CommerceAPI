"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Icon from "@/components/ui/icon";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React from "react";
import { Category } from "kysely-codegen";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { LoadingSpinner } from "../loadingspinner";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import Link from "next/link";

export function Categories() {
  const limitBy = 8;
  const [offset, setOffset] = React.useState(0);
  const fetchCategories = (offset: number) =>
    fetch(`/api/categories?limit=${limitBy}&offset=${offset}`).then(
      async (res) => {
        if (!res.ok) return Promise.reject(await res.json());
        return res.json();
      },
    );
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["categories", offset],
      queryFn: () => fetchCategories(offset),
      placeholderData: keepPreviousData,
    });

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      {isError ? (
        <div className="text-red-500 text-center">
          <p>Error: {error.message}</p>
        </div>
      ) : (
        <>
          <div className="px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isPending ? (
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-950 dark:border-gray-800"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-5 w-5" />
                        </div>
                        <Skeleton className="mt-4 h-6 w-2/3" />
                        <Skeleton className="mt-2 h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-4/5" />
                      </div>
                    </div>
                  ))
              ) : (
                <>
                  {data.data.map((category: Category) => (
                    <div
                      key={category.name}
                      className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-950 dark:border-gray-800"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="text-4xl">
                            <Icon
                              name={
                                category.icon as unknown as keyof typeof dynamicIconImports
                              }
                            />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                      <Link
                        href={`/categories/${category.id}/products`}
                        className="absolute inset-0"
                        aria-label={`Browse ${category.name}`}
                      >
                        <span className="sr-only">Browse {category.name}</span>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </div>
            {!isPending && data.data?.length === 0 && (
              <p className="text-center mt-8 text-lg text-gray-500 dark:text-gray-400">
                No Categories found.
              </p>
            )}
            <div className="flex gap-10 mt-10 justify-center">
              {isFetching ? (
                <LoadingSpinner />
              ) : data.data?.length > 0 ? (
                <>
                  <div className="text-center">
                    <Button
                      variant="outline"
                      className="disabled:bg-gray-300 disabled:opacity-50"
                      disabled={
                        isPending ||
                        isPlaceholderData ||
                        !data?.meta.has_previous_page
                      }
                      onClick={() => setOffset((old) => old - limitBy)}
                    >
                      <ChevronLeft className="ml-2 h-4 w-4" />
                      Prev
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button
                      variant="outline"
                      className="disabled:bg-gray-300 disabled:opacity-50"
                      disabled={
                        isPending ||
                        isPlaceholderData ||
                        !data?.meta.has_next_page
                      }
                      onClick={() => {
                        if (
                          !isPlaceholderData &&
                          parseInt(data?.meta.total) > offset
                        ) {
                          setOffset((old) => old + limitBy);
                        }
                      }}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
