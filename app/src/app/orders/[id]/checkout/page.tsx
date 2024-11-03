"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCardInputSchema,
  CreditCardInputSchemaType,
  ShippingAddressInputSchema,
  ShippingAddressInputSchemaType,
} from "@/zodTypes";
import toast from "react-hot-toast";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckOutPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0);
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues: getShippingValues,
    setError: setShippingError,
  } = useForm<ShippingAddressInputSchemaType>({
    values: {
      full_name: "Abdulrahman AlGhoul",
      address: "23 July Street",
      city: "Al-Arish",
      country: "Egypt",
      postal_code: "45111",
      payment_method: "credit_card",
    },
    resolver: zodResolver(ShippingAddressInputSchema),
  });
  const {
    control: paymentControl,
    getValues: getPaymentValues,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    setError: setPaymentError,
  } = useForm<CreditCardInputSchemaType>({
    values: {
      card_number: (4242424242424242).toString(),
      card_holder: "Abdulrahman AlGhoul",
      card_expiry: "12/24",
      card_cvv: "123",
    },
    resolver: zodResolver(CreditCardInputSchema),
  });

  const mutation = useMutation({
    mutationFn: async (
      data: ShippingAddressInputSchemaType & CreditCardInputSchemaType,
    ) => {
      const response = await fetch(`/api/orders/${params.id}/payment`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return Promise.reject(await response.json());
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      if ("data" in error) {
        Object.entries(error.data as { [key: string]: Array<string> }).forEach(
          ([key, value]) => {
            setShippingError(key as ShippingAddressInputSchemaType & "root", {
              type: "custom",
              message: value[0],
            });
            setPaymentError(key as CreditCardInputSchemaType & "root", {
              type: "custom",
              message: value[0],
            });
          },
        );
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium">{step}</span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-1 mx-2 bg-gray-200">
                    <div
                      className="h-full bg-primary"
                      style={{ width: index < currentStep ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {getOrderItemsReq.isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : getOrderItemsReq.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {getOrderItemsReq.error.detail}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                {currentStep === 0 && (
                  <form
                    onSubmit={handleSubmit(() => {
                      handleNextStep();
                    })}
                  >
                    <h2 className="text-xl font-semibold mb-4">
                      Shipping Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>

                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              type="full_name"
                              id="full_name"
                              name="full_name"
                              className="w-full border border-gray-400 p-2 rounded-lg"
                              required
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                          name="full_name"
                        />
                        {errors.full_name ? (
                          <p className="text-red-500 mb-4 text-center">
                            {errors.full_name.message}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <textarea
                              id="address"
                              name="address"
                              className="w-full border border-gray-400 p-2 rounded-lg"
                              required
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                          name="address"
                        />
                        {errors.address ? (
                          <p className="text-red-500 mb-4 text-center">
                            {errors.address.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <input
                                type="text"
                                id="city"
                                name="city"
                                className="w-full border border-gray-400 p-2 rounded-lg"
                                required
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                              />
                            )}
                            name="city"
                          />
                          {errors.city ? (
                            <p className="text-red-500 mb-4 text-center">
                              {errors.city.message}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Controller
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <input
                                type="text"
                                id="country"
                                name="country"
                                className="w-full border border-gray-400 p-2 rounded-lg"
                                required
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                              />
                            )}
                            name="country"
                          />
                          {errors.country ? (
                            <p className="text-red-500 mb-4 text-center">
                              {errors.country.message}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              type="text"
                              id="postal_code"
                              name="postal_code"
                              className="w-full border border-gray-400 p-2 rounded-lg"
                              required
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                          name="postal_code"
                        />
                        {errors.postal_code ? (
                          <p className="text-red-500 mb-4 text-center">
                            {errors.postal_code.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <Button type="submit" className="mt-6">
                      Continue to Payment
                    </Button>
                  </form>
                )}
                {currentStep === 1 && (
                  <form
                    onSubmit={handlePaymentSubmit(() => {
                      handleNextStep();
                    })}
                  >
                    <h2 className="text-xl font-semibold mb-4">
                      Payment Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Controller
                          control={paymentControl}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              type="number"
                              id="card_number"
                              name="card_number"
                              className="w-full border border-gray-400 p-2 rounded-lg"
                              required
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                          name="card_number"
                        />
                        {paymentErrors.card_number ? (
                          <p className="text-red-500 mb-4 text-center">
                            {paymentErrors.card_number.message}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="cardHolder">Card Holder</Label>
                        <Controller
                          control={paymentControl}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <input
                              type="text"
                              id="card_holder"
                              name="card_holder"
                              className="w-full border border-gray-400 p-2 rounded-lg"
                              required
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                          name="card_holder"
                        />
                        {paymentErrors.card_holder ? (
                          <p className="text-red-500 mb-4 text-center">
                            {paymentErrors.card_holder.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Controller
                            control={paymentControl}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <input
                                type="text"
                                id="card_expiry"
                                name="card_expiry"
                                className="w-full border border-gray-400 p-2 rounded-lg"
                                required
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                              />
                            )}
                            name="card_expiry"
                          />
                          {paymentErrors.card_expiry ? (
                            <p className="text-red-500 mb-4 text-center">
                              {paymentErrors.card_expiry.message}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Controller
                            control={paymentControl}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { onChange, onBlur, value },
                            }) => (
                              <input
                                type="text"
                                id="card_cvv"
                                name="card_cvv"
                                className="w-full border border-gray-400 p-2 rounded-lg"
                                required
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                              />
                            )}
                            name="card_cvv"
                          />
                          {paymentErrors.card_cvv ? (
                            <p className="text-red-500 mb-4 text-center">
                              {paymentErrors.card_cvv.message}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                      >
                        Back
                      </Button>
                      <Button type="submit">Review Order</Button>
                    </div>
                  </form>
                )}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Review Your Order
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Shipping Information:</h3>
                        <p>{getShippingValues().full_name}</p>
                        <p>{getShippingValues().address}</p>
                        <p>{`${getShippingValues().city}, ${getShippingValues().country} ${getShippingValues().postal_code}`}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Payment Information:</h3>
                        <p>
                          Card ending in
                          {getPaymentValues().card_number.toString().slice(-4)}
                        </p>
                        <p>{getPaymentValues().card_holder}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Order Items:</h3>
                        {getOrderItemsReq.data?.data.map((item: OrderItem) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                            <span>
                              $
                              {(item.price_at_purchase * item.quantity).toFixed(
                                2,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          const shipping = getShippingValues();
                          const payment = getPaymentValues();
                          mutation
                            .mutateAsync({ ...shipping, ...payment })
                            .then(() => {
                              toast.success("Order placed successfully");
                            })
                            .catch((err) => {
                              toast.error(err.detail);
                            });
                        }}
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    {getOrderItemsReq.data?.data.map((item: OrderItem) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>
                          ${(item.price_at_purchase * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${getOrderReq.data?.data.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
