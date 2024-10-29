"use client";

import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import { Category } from "kysely-codegen";
import Image from "next/image";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const limitBy = 12;
  const [offset, setOffset] = useState(0);
  const fetchProducts = (offset: number, category_id: number, sortBy: string) =>
    fetch(
      `/api/products?limit=${limitBy}&offset=${offset}&category=${category_id}&sortBy=${sortBy === "priceHigh" ? "price" : sortBy === "priceLow" ? "price" : sortBy}&orderBy=${sortBy === "priceHigh" ? "desc" : sortBy === "priceLow" ? "asc" : "asc"}`,
    ).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["categories", offset, selectedCategory, sortBy],
      queryFn: () => fetchProducts(offset, selectedCategory, sortBy),
      placeholderData: keepPreviousData,
    });

  const fetchCategories = () =>
    fetch(`/api/categories/?limit=50`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const categoriesReq = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const fetchCategoriesProducts = (q: string) =>
    fetch(`/api/products/search?q=${q}`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const {
    data: searchData,
    isError: searchIsError,
    error: searchError,
    isFetching: searchIsFetching,
  } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => fetchCategoriesProducts(searchQuery),
    enabled: searchQuery.length > 0,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          {isError || searchIsError ? (
            <div className="text-red-500 text-center">
              <p>
                Error:
                {isError
                  ? error.message
                  : searchIsError
                    ? searchError.message
                    : null}
              </p>
            </div>
          ) : (
            <>
              <div className="px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Our Products
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <form
                      className="flex-1 relative"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <Input
                        className="w-full"
                        placeholder="Search products..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchIsFetching ? (
                        <div className="absolute right-2 top-2 w-6 h-6 rounded-full animate-spin border-y-4 border-solid border-blue-500 border-t-transparent shadow-md"></div>
                      ) : null}
                    </form>
                    <div className="flex gap-4">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="priceLow">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="priceHigh">
                            Price: High to Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" className="w-[120px]">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Filter Products</SheetTitle>
                            <SheetDescription>
                              Choose a category to filter the products.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            {categoriesReq.isFetching ? (
                              <LoadingSpinner />
                            ) : (
                              [
                                { id: -1, name: "All" },
                                ...(categoriesReq.data
                                  .data as unknown as Category[]),
                              ].map((category) => (
                                <Button
                                  // @ts-expect-error The id is a string
                                  key={category.id}
                                  variant={
                                    selectedCategory ===
                                      (category.id as unknown as number)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="justify-start"
                                  onClick={() => {
                                    setSelectedCategory(
                                      category.id as unknown as number,
                                    );
                                    setOffset(0);
                                    setSearchQuery("");
                                  }}
                                >
                                  {category.name}
                                </Button>
                              ))
                            )}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {isFetching
                    ? Array(12)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-950 dark:border-gray-800"
                        >
                          <Skeleton className="h-[200px] w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/3 mb-4" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </div>
                      ))
                    : searchData?.data?.length > 0
                      ? searchData.data.map((product: CategoryProduct) => (
                        <div
                          key={product.id}
                          className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-950 dark:border-gray-800"
                        >
                          <Image
                            src="/placeholder.svg"
                            alt={product.name}
                            className="object-cover w-full h-[200px]"
                            width={200}
                            height={200}
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {product.category_name}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </div>
                        </div>
                      ))
                      : data.data.map((product: CategoryProduct) => (
                        <div
                          key={product.id}
                          className="group relative overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-950 dark:border-gray-800"
                        >
                          <Image
                            src="/placeholder.svg"
                            alt={product.name}
                            className="object-cover w-full h-[200px]"
                            width={200}
                            height={200}
                          />
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {product.category_name}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                {!isFetching && data?.length === 0 && (
                  <p className="text-center mt-8 text-lg text-gray-500 dark:text-gray-400">
                    No products found. Try adjusting your filters or search
                    query.
                  </p>
                )}
              </div>
              <div className="flex gap-10 mt-10 justify-center">
                {isFetching ? (
                  <LoadingSpinner />
                ) : !searchData?.data || searchData?.data?.length < 0 ? (
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}
