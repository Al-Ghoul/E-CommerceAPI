"use client";
import { Loader2, Package, Truck, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const router = useRouter();

  const fetchOrder = () =>
    fetch(`/api/orders/${params.id}`).then(async (res) => {
      if (!res.ok) {
        if (res.status === 404) {
          router.push("/404");
        }
        return Promise.reject(await res.json());
      }
      return res.json();
    });
  const getOrderReq = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => fetchOrder(),
  });

  const fetchOrderItems = () =>
    fetch(`/api/orders/${params.id}/items`).then(async (res) => {
      if (!res.ok) return Promise.reject(await res.json());
      return res.json();
    });
  const getOrderItemsReq = useQuery({
    queryKey: ["orderItems", params.id],
    queryFn: () => fetchOrderItems(),
    enabled: getOrderReq.isSuccess,
  });

  const statusColors = {
    pending: "bg-yellow-200 text-yellow-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-200 text-green-800",
    canceled: "bg-red-200 text-red-800",
  };

  if (getOrderReq.isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (getOrderReq.isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{getOrderReq.error.detail}</AlertDescription>
      </Alert>
    );
  }

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
          <h1 className="text-2xl font-bold mb-6">Order Details</h1>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order {getOrderReq.data.data.id}</span>
                <Badge
                  className={
                    statusColors[getOrderReq.data.data.fulfillment_status]
                  }
                >
                  {getOrderReq.data.data.fulfillment_status
                    .charAt(0)
                    .toUpperCase() +
                    getOrderReq.data.data.fulfillment_status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
                <p className="text-sm text-gray-500">
                  Date:
                  {new Date(getOrderReq.data.data.created_at).toLocaleString()}
                </p>
                <p className="font-semibold">
                  Total: ${getOrderReq.data.data.total_amount}
                </p>
              </div>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold mb-2">Items</h2>
                <ul className="space-y-2">
                  {!getOrderItemsReq.isFetching &&
                    getOrderItemsReq.data.data.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>
                          ${(item.price_at_purchase * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <Separator />
              {getOrderReq.data.data.fulfillment_status !== "pending" &&
                getOrderReq.data.data.fulfillment_status !== "canceled" &&
                getOrderReq.data.data.payment_details && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Payment Details
                    </h2>
                    <p>
                      Method: {getOrderReq.data.data.payment_details.method}
                    </p>
                    <p>
                      Last 4 digits:
                      {getOrderReq.data.data.payment_details.last4}
                    </p>
                    <p>
                      Amount: $
                      {getOrderReq.data.data.payment_details.amount.toFixed(2)}
                    </p>
                  </div>
                )}
              {getOrderReq.data.data.fulfillment_status === "delivered" &&
                getOrderReq.data.data.shipping_details && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      Shipping Details
                    </h2>
                    <p>{getOrderReq.data.data.shipping_details.address}</p>
                    <p>
                      {getOrderReq.data.data.shipping_details.city},
                      {getOrderReq.data.data.shipping_details.country}
                      {getOrderReq.data.data.shipping_details.postal_code}
                    </p>
                  </div>
                )}
              {getOrderReq.data.data.fulfillment_status === "canceled" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Order Canceled</AlertTitle>
                  <AlertDescription>
                    This order has been canceled. If you have any questions,
                    please contact customer support.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              {getOrderReq.data.data.fulfillment_status === "pending" && (
                <Link
                  href={`/orders/${getOrderReq.data.data.id}/checkout`}
                  className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Checkout
                </Link>
              )}
              {getOrderReq.data.data.fulfillment_status === "shipped" && (
                <div className="w-full text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2" />
                  <p>Your order is on its way!</p>
                </div>
              )}
              {getOrderReq.data.data.fulfillment_status === "delivered" && (
                <div className="w-full text-center">
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <p>Your order has been delivered. Enjoy!</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </motion.div>
  );
}
