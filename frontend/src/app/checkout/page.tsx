"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, CheckCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import { toast } from "sonner";

const shippingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "bank_transfer"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).refine((data) => data.paymentMethod !== "card" || (data.cardNumber && data.cardExpiry && data.cardCvc), {
  message: "Card details are required",
  path: ["cardNumber"],
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "card" },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button asChild className="mt-4">
            <a href="/gallery">Continue Shopping</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingFormData) => {
    setStep(2);
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setLoading(true);
    try {
      const orderData = {
        payment_method: data.paymentMethod,
        name: shippingForm.getValues("name"),
        email: shippingForm.getValues("email"),
        phone: shippingForm.getValues("phone") || "",
        address: shippingForm.getValues("address"),
        city: shippingForm.getValues("city"),
        items: items.map((item) => ({
          artwork_id: item.artwork.id,
          qty: item.quantity,
        })),
      };

      const response = await api.post("/orders/", orderData);
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success/${response.data.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Shipping", icon: Truck },
    { number: 2, label: "Payment", icon: CreditCard },
    { number: 3, label: "Confirm", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((stepItem, index) => (
              <motion.div
                key={stepItem.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium ${
                    step >= stepItem.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > stepItem.number && <CheckCircle className="h-6 w-6" />}
                  {step <= stepItem.number && <stepItem.icon className="h-6 w-6" />}
                </div>
                <span className="mt-2 text-sm font-medium">{stepItem.label}</span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -translate-x-1/2 ${
                      step > stepItem.number ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="1">Shipping</TabsTrigger>
                <TabsTrigger value="2">Payment</TabsTrigger>
                <TabsTrigger value="3">Confirm</TabsTrigger>
              </TabsList>

              <TabsContent value="1">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" {...shippingForm.register("name")} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" {...shippingForm.register("email")} className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" {...shippingForm.register("phone")} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input id="address" {...shippingForm.register("address")} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" {...shippingForm.register("city")} className="mt-1" />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Continue to Payment
                        <CreditCard className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                      <div className="space-y-3">
                        <Label>Choose Payment Method</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {["card", "bank_transfer"].map((method) => (
                            <label
                              key={method}
                              className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                                paymentForm.watch("paymentMethod") === method
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <input
                                type="radio"
                                value={method}
                                checked={paymentForm.watch("paymentMethod") === method}
                                onChange={(e) => paymentForm.setValue("paymentMethod", e.target.value as "card" | "bank_transfer")}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-3">
                                {method === "card" ? <CreditCard className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                                <span className="font-medium capitalize">{method.replace("_", " ")}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {paymentForm.watch("paymentMethod") === "card" && (
                        <div className="space-y-4 border-t pt-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            <span>Secure payment processed by Stripe</span>
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="4242 4242 4242 4242"
                              {...paymentForm.register("cardNumber")}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="cardExpiry">Expiry</Label>
                              <Input
                                id="cardExpiry"
                                placeholder="MM/YY"
                                {...paymentForm.register("cardExpiry")}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCvc">CVC</Label>
                              <Input
                                id="cardCvc"
                                placeholder="123"
                                type="password"
                                {...paymentForm.register("cardCvc")}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentForm.watch("paymentMethod") === "bank_transfer" && (
                        <div className="space-y-4 border-t pt-6">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="font-medium mb-2">Bank Transfer Details</p>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p><strong>Bank:</strong> Duluwa Art Gallery</p>
                              <p><strong>Account:</strong> 1234567890</p>
                              <p><strong>Routing:</strong> 021000021</p>
                              <p><strong>Reference:</strong> Your order number</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Please allow 1-3 business days for payment to clear. Your order will be confirmed once payment is received.
                            </p>
                          </div>
                        </div>
                      )}

                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Continue to Confirm
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="3">
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Shipping to</h4>
                      <address className="not-italic text-muted-foreground whitespace-pre-line">
                        {shippingForm.getValues("name")}
                        {shippingForm.getValues("address")}
                        {shippingForm.getValues("city")}
                        {shippingForm.getValues("phone")}
                      </address>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Payment Method</h4>
                      <p className="text-muted-foreground capitalize">
                        {paymentForm.getValues("paymentMethod").replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Items</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {items.map((item) => (
                          <div key={item.artwork.id} className="flex justify-between text-sm">
                            <span>{item.artwork.title} × {item.quantity}</span>
                            <span>{formatPrice(item.artwork.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(total - subtotal)}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>
                    <Button type="button" onClick={() => paymentForm.handleSubmit(handlePaymentSubmit)()} className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.artwork.id} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                        {item.artwork.image ? (
                          <img src={item.artwork.image} alt={item.artwork.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-xs">Preview</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.artwork.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-medium text-primary">{formatPrice(item.artwork.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span>{formatPrice(total - subtotal)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}