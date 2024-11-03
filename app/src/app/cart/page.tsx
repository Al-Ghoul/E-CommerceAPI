"use client";

import { useState, useEffect, useContext } from "react";
import { Trash2, Minus, Plus, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/lib/contexts";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItemInputType {
  itemId: number;
  quantity: number;
}

export default function CartPage() {
  const auth = useContext(AuthContext);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchCart = () =>
    fetch(`/api/users/${auth.userId}/carts`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const cartReq = useQuery({
    queryKey: ["userCart", auth.userId],
    queryFn: () => fetchCart(),
  });

  const fetchCartItems = () =>
    fetch(`/api/carts/${cartReq.data.data?.id}/items`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const cartItemsReq = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => fetchCartItems(),
    enabled: !!cartReq.data,
  });

  const updateCartItem = (input: CartItemInputType) =>
    fetch(`/api/carts/${cartReq.data.data?.id}/items/${input.itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: input.quantity }),
    }).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const updateCartItemReq = useMutation({
    mutationKey: ["cartItem"],
    mutationFn: (input: CartItemInputType) => updateCartItem(input),
  });

  const deleteCartItem = (itemId: number) =>
    fetch(`/api/carts/${cartReq.data.data?.id}/items/${itemId}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const deleteCartItemReq = useMutation({
    mutationKey: ["cartItem"],
    mutationFn: (itemId: number) => deleteCartItem(itemId),
  });

  const createOrder = (cart_id: number) =>
    fetch(`/api/users/${auth.userId}/orders`, {
      method: "POST",
      body: JSON.stringify({ cart_id }),
    }).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const createOrderReq = useMutation({
    mutationKey: ["userOrder", auth.userId],
    mutationFn: (cart_id: number) => createOrder(cart_id),
  });

  useEffect(() => {
    const newTotal =
      cartItemsReq.data?.data.reduce(
        (sum: number, item: CartItemWithPrice) =>
          sum + item.price * item.quantity,
        0,
      ) || 0;
    setTotal(newTotal);
  }, [cartItemsReq.data?.data]);

  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{
        opacity: 0,
        y: -50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0,
        duration: 0.7,
      }}
    >
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
          {cartItemsReq.isError || cartReq.isError ? (
            <div className="text-red-500 text-center">
              <p>
                Error:
                {cartReq.isError
                  ? cartReq.error.detail
                  : cartItemsReq.isError
                    ? cartItemsReq.error.detail
                    : null}
              </p>
            </div>
          ) : cartItemsReq.isPending ? (
            <LoadingSpinner />
          ) : cartItemsReq.data?.data.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                {cartItemsReq.data?.data.map((item: CartItemWithPrice) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b">
                    <Image
                      src="/placeholder.svg"
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            updateCartItemReq
                              .mutateAsync({
                                itemId: item.id,
                                quantity: +item.quantity - 1,
                              })
                              .then(() => {
                                cartItemsReq.refetch();
                                toast.success(`${item.name} decreased by 1`);
                              })
                              .catch((err) => {
                                toast.error(err.message);
                              });
                          }}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            updateCartItemReq
                              .mutateAsync({
                                itemId: item.id,
                                quantity: parseInt(e.target.value) || 1,
                              })
                              .then(() => {
                                cartItemsReq.refetch();
                                toast.success(`${item.name} increased by 1`);
                              })
                              .catch((err) => {
                                toast.error(err.message);
                              });
                          }}
                          className="w-16 text-center"
                          aria-label={`Quantity of ${item.name}`}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            updateCartItemReq
                              .mutateAsync({
                                itemId: item.id,
                                quantity: +item.quantity + 1,
                              })
                              .then(() => {
                                cartItemsReq.refetch();
                                toast.success(`${item.name} increased by 1`);
                              })
                              .catch((err) => {
                                toast.error(err.message);
                              });
                          }}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        disabled={deleteCartItemReq.isPending}
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          deleteCartItemReq.mutateAsync(item.id).then(() => {
                            cartItemsReq.refetch();
                            toast.success(`${item.name} removed from cart`);
                          });
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    {cartItemsReq.data?.data.map((item: CartItemWithPrice) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Button
                    disabled={createOrderReq.isPending}
                    className="w-full mt-6"
                    onClick={() => {
                      createOrderReq
                        .mutateAsync(Number(cartReq.data.data?.id))
                        .then(() => {
                          toast.success("Order placed successfully");
                          router.push("/orders");
                        })
                        .catch((err) => {
                          console.log(err);
                          toast.error(err.message || err.detail);
                        });
                    }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
