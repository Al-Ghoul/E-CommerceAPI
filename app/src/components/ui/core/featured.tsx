import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CartItemInputSchemaType } from "@/zodTypes";
import { useContext } from "react";
import { AuthContext } from "@/lib/contexts";
import toast from "react-hot-toast";

export function Featured() {
  const auth = useContext(AuthContext);
  const limitBy = 4;
  const fetchProducts = () =>
    fetch(`/api/products?limit=${limitBy}`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["categories", limitBy],
    queryFn: () => fetchProducts(),
  });

  const fetchCart = () =>
    fetch(`/api/users/${auth.userId}/carts`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const cartReq = useQuery({
    queryKey: ["userCart", auth.userId],
    queryFn: () => fetchCart(),
    enabled: !!auth.userId,
  });

  const createCart = () =>
    fetch(`/api/users/${auth.userId}/carts`, { method: "POST" }).then(
      async (res) => {
        if (!res.ok) return Promise.reject(await res.json());
        return res.json();
      },
    );
  const createCartReq = useMutation({
    mutationKey: ["userCart", auth.userId],
    mutationFn: () => createCart(),
  });

  const createCartItem = (ItemData: CartItemInputSchemaType) =>
    fetch(
      `/api/carts/${cartReq.data?.data.id || createCartReq.data?.data.id}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ItemData),
      },
    ).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const createCartItemReq = useMutation({
    mutationKey: [
      "userCart",
      cartReq.data?.data.id || createCartReq.data?.data.id,
    ],
    mutationFn: (ItemData: CartItemInputSchemaType) => createCartItem(ItemData),
  });

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
          Featured Products
        </h2>
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="sr-only">Loading products...</span>
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.data.map((product: CategoryProduct) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  src="/placeholder.svg"
                  alt={product.name}
                  className="object-cover w-full h-60"
                  width={200}
                  height={200}
                />
                <div className="p-4 bg-white dark:bg-gray-950">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <Badge variant="secondary">
                      {product.subcategory_name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!auth.userId) {
                          toast.error("Please login to add products to cart");
                          return;
                        }
                        if (cartReq.isError && !createCartReq.data) {
                          createCartReq.mutate();
                        } else {
                          createCartItemReq
                            .mutateAsync({
                              product_id: product.id,
                              quantity: 1,
                            })
                            .then(() => {
                              toast.success(`${product.name} added to cart`);
                            })
                            .catch((err) => {
                              toast.error(err.message);
                            });
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Products
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
