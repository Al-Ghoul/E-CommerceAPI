"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Filter, ArrowLeft } from "lucide-react";
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
import { Product, Subcategory } from "kysely-codegen";
import Link from "next/link";
import Image from "next/image";

// @ts-expect-error override types just for this page
interface CategoryProduct extends Product {
  id: string;
  subcategory_name: string;
  price: string;
}

export default function ProductsPage({ params }: { params: { id: string } }) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>();
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const limitBy = 12;
  const [offset, setOffset] = useState(0);
  const fetchProducts = (
    offset: number,
    subcategory: string | undefined,
    sortBy: string,
  ) =>
    fetch(
      `/api/categories/${params.id}/products?limit=${limitBy}&offset=${offset}&subcategory=${subcategory}&sortBy=${sortBy === "priceHigh" ? "price" : sortBy === "priceLow" ? "price" : sortBy}&orderBy=${sortBy === "priceHigh" ? "desc" : sortBy === "priceLow" ? "asc" : "asc"}`,
    ).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["categories", offset, selectedSubcategory, sortBy],
      queryFn: () => fetchProducts(offset, selectedSubcategory, sortBy),
      placeholderData: keepPreviousData,
    });

  const fetchCategoriesProducts = (q: string) =>
    fetch(`/api/categories/${params.id}/products/search?q=${q}`).then(
      async (res) => {
        if (!res.ok) return Promise.reject(await res.json());
        return res.json();
      },
    );
  const {
    data: searchData,
    isError: searchIsError,
    error: searchError,
    isFetching: searchIsFetching,
  } = useQuery({
    queryKey: ["categories", searchQuery],
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
                Error:{" "}
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
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Link className="w-9 flex-shrink-0" href="/categories">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back to categories</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      {isFetching ? (
                        <LoadingSpinner />
                      ) : (
                        data?.meta.category_name
                      )}
                    </h1>
                  </div>
                  {data?.meta.category_description ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      {data?.meta.category_description}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <form
                      className="flex-1 relative"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <Input
                        className="w-full"
                        placeholder={`Search ${data?.meta.category_description ? data?.meta.category_description : ""}...`}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchIsFetching ? (
                        <div className="absolute right-2 top-2 w-6 h-6 rounded-full animate-spin border-y-4 border-solid border-blue-500 border-t-transparent shadow-md"></div>
                      ) : null}
                    </form>
                    <div className="flex gap-4">
                      <Select
                        value={sortBy}
                        onValueChange={(value) => {
                          setSortBy(value);
                          setSearchQuery("");
                        }}
                      >
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
                              Refine your product search with these filters.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">Subcategory</h3>
                              {data?.meta.subCategories.map(
                                (subcategory: Subcategory) => (
                                  <Button
                                    // @ts-expect-error the id will be a string
                                    key={subcategory.id}
                                    variant={
                                      selectedSubcategory ===
                                        (subcategory.id as unknown as string)
                                        ? "default"
                                        : "outline"
                                    }
                                    className="mr-2 mb-2"
                                    onClick={() => {
                                      setSelectedSubcategory(
                                        subcategory.id as unknown as string,
                                      );
                                      setOffset(0);
                                      setSearchQuery("");
                                    }}
                                  >
                                    {subcategory.name}
                                  </Button>
                                ),
                              )}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {isPending
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
                              {product.subcategory_name}
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
                              {product.subcategory_name}
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
                {!isFetching && data?.data === 0 && (
                  <p className="text-center mt-8 text-lg text-gray-500 dark:text-gray-400">
                    No products found. Try adjusting your filters or search
                    query.
                  </p>
                )}
              </div>
              <div className="flex gap-10 mt-10 justify-center">
                {isFetching ? (
                  <LoadingSpinner />
                ) : (
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
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}