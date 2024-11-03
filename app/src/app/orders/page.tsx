"use client";

import { useState, useContext } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/lib/contexts";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrderListPage() {
  const auth = useContext(AuthContext);
  const limitBy = 12;
  const [offset, setOffset] = useState(0);
  const fetchOrders = (offset: number) =>
    fetch(
      `/api/users/${auth.userId}/orders/?limit=${limitBy}&offset=${offset}`,
    ).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const getOrdersReq = useQuery({
    queryKey: ["orders", offset],
    queryFn: () => fetchOrders(offset),
    placeholderData: keepPreviousData,
  });

  const statusColors = {
    pending: "bg-yellow-200 text-yellow-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-200 text-green-800",
    canceled: "bg-red-200 text-red-800",
  };

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
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
          {!getOrdersReq.isFetching && getOrdersReq.data.data?.length === 0 && (
            <p className="text-center mt-8 text-lg text-gray-500 dark:text-gray-400">
              No orders found.
            </p>
          )}
          {getOrdersReq.isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getOrdersReq.data.data.map((order: Order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Order {order.id}</span>
                        <Badge
                          className={statusColors[order.fulfillment_status]}
                        >
                          {order.fulfillment_status.charAt(0).toUpperCase() +
                            order.fulfillment_status.slice(1)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">
                        Date: {new Date(order.created_at).toLocaleString()}
                      </p>
                      <p className="font-semibold mb-2">
                        Total: ${order.total_amount}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-10 w-full">
                        <Link
                          href={`/orders/${order.id}/details`}
                          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                          Details
                        </Link>
                        {order.fulfillment_status === "pending" && (
                          <Link
                            href={`/orders/${order.id}/checkout`}
                            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                          >
                            Checkout
                          </Link>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="flex gap-10 mt-10 justify-center">
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="disabled:bg-gray-300 disabled:opacity-50"
                    disabled={
                      getOrdersReq.isPending ||
                      getOrdersReq.isPlaceholderData ||
                      !getOrdersReq.data?.meta.has_previous_page
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
                      getOrdersReq.isPending ||
                      getOrdersReq.isPlaceholderData ||
                      !getOrdersReq.data?.meta.has_next_page
                    }
                    onClick={() => {
                      if (
                        !getOrdersReq.isPlaceholderData &&
                        parseInt(getOrdersReq.data?.meta.total) > offset
                      ) {
                        setOffset((old) => old + limitBy);
                      }
                    }}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </motion.div>
  );
}
