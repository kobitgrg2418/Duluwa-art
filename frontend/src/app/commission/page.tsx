"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Palette, Brush, Image, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";

const commissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Please select an artwork type"),
  size: z.string().optional(),
  medium: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(20, "Please provide more details about your vision"),
  refImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type CommissionFormData = z.infer<typeof commissionSchema>;

const artworkTypes = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "abstract", label: "Abstract" },
  { value: "still-life", label: "Still Life" },
  { value: "custom", label: "Custom / Other" },
];

const sizeOptions = [
  { value: "", label: "Select size" },
  { value: "small", label: "Small (up to 12\")" },
  { value: "medium", label: "Medium (12\" - 24\")" },
  { value: "large", label: "Large (24\" - 36\")" },
  { value: "extra-large", label: "Extra Large (36\"+)" },
];

const mediumOptions = [
  { value: "", label: "Select medium" },
  { value: "oil", label: "Oil Paint" },
  { value: "acrylic", label: "Acrylic" },
  { value: "watercolor", label: "Watercolor" },
  { value: "mixed", label: "Mixed Media" },
  { value: "charcoal", label: "Charcoal / Graphite" },
  { value: "digital", label: "Digital" },
];

const budgetOptions = [
  { value: "", label: "Select budget range" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2500", label: "$1,000 - $2,500" },
  { value: "2500-5000", label: "$2,500 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000+", label: "$10,000+" },
];

export default function CommissionPage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
  });

  const onSubmit = async (data: CommissionFormData) => {
    setSubmitting(true);
    try {
      await api.post("/commission/", data);
      toast.success("Commission request submitted! We'll contact you within 24 hours.");
      reset();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="site">
      <DuluwaNavbar />
      
      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-center gap-2 text-red-500"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Custom Artwork</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-center"
          >
            Commission Your{" "}
            <span className="text-red-500">Masterpiece</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 text-center max-w-3xl mx-auto"
          >
            Work directly with our talented artists to create a one-of-a-kind piece tailored to your vision,
            space, and story.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* How It Works */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                <div className="space-y-8">
                  {[
                    { icon: Palette, title: "Share Your Vision", desc: "Tell us about your idea, style preferences, and requirements." },
                    { icon: Brush, title: "Artist Matching", desc: "We connect you with the perfect artist for your project." },
                    { icon: Image, title: "Review & Approve", desc: "See sketches and progress, request revisions until it's perfect." },
                    { icon: Sparkles, title: "Delivery", desc: "Receive your completed artwork with certificate of authenticity." },
                  ].map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-red-500 shrink-0">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{step.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Commission Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Commission Request Form</CardTitle>
                    <CardDescription>Fill out the details below to start your custom artwork journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register("name")}
                            className="mt-1"
                          />
                          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            className="mt-1"
                          />
                          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="type" className="text-sm font-medium">Artwork Type *</Label>
                        <Select
                          onValueChange={(v) => register("type").onChange({ target: { value: v } })}
                          defaultValue={""}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select artwork type" />
                          </SelectTrigger>
                          <SelectContent>
                            {artworkTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="size" className="text-sm font-medium">Preferred Size</Label>
                          <Select
                            onValueChange={(v) => register("size").onChange({ target: { value: v } })}
                            defaultValue={""}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizeOptions.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="medium" className="text-sm font-medium">Preferred Medium</Label>
                          <Select
                            onValueChange={(v) => register("medium").onChange({ target: { value: v } })}
                            defaultValue={""}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select medium" />
                            </SelectTrigger>
                            <SelectContent>
                              {mediumOptions.map((medium) => (
                                <SelectItem key={medium.value} value={medium.value}>
                                  {medium.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-sm font-medium">Budget Range</Label>
                          <Select
                            onValueChange={(v) => register("budget").onChange({ target: { value: v } })}
                            defaultValue={""}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetOptions.map((budget) => (
                                <SelectItem key={budget.value} value={budget.value}>
                                  {budget.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium">Your Vision & Details *</Label>
                        <Textarea
                          id="message"
                          placeholder="Describe your vision, color preferences, mood, inspiration images, intended space, and any other details that will help the artist understand your project..."
                          rows={6}
                          {...register("message")}
                          className="mt-1"
                        />
                        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                        <p className="mt-1 text-sm text-gray-500">
                          The more details you provide, the better we can match you with the right artist and create exactly what you envision.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="refImage" className="text-sm font-medium">Reference Image URL (Optional)</Label>
                        <Input
                          id="refImage"
                          type="url"
                          placeholder="https://example.com/inspiration.jpg"
                          {...register("refImage")}
                          className="mt-1"
                        />
                        {errors.refImage && <p className="mt-1 text-sm text-red-500">{errors.refImage.message}</p>}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto bg-black text-white hover:bg-red-500 hover:text-white transition-colors" 
                        size="lg" 
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Commission Request"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Commission with Duluwa?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: "Curated Artists", desc: "Hand-selected artists with proven expertise and unique styles." },
              { icon: Brush, title: "Collaborative Process", desc: "You're involved at every stage, from concept to final touches." },
              { icon: Sparkles, title: "Quality Guaranteed", desc: "Professional materials, archival quality, and authenticity certificates." },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center p-8 bg-white rounded-xl shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GenZGlassyFooter />
    </main>
  );
}
