"use client";

import { motion } from "framer-motion";
import { Palette, Heart, Award, Users, Target, Brush, Sparkles, Instagram, Facebook, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DuluwaNavbar from "@/components/duluwa-navbar";
import GenZGlassyFooter from "@/components/genz-footer";

export default function AboutPage() {
  return (
    <main className="site">
      <DuluwaNavbar />

      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <Badge className="bg-red-500 text-white hover:bg-red-600 border-0">
              Our Story
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-center"
          >
            About{" "}
            <span className="text-red-500">Duluwa Art</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 text-center max-w-3xl mx-auto"
          >
            Where creativity meets passion. Discover the story behind our art gallery and the artist who brings visions to life.
          </motion.p>
        </div>
      </section>

      {/* Artist Story Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">The Artist Behind Duluwa</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Duluwa Art Gallery was born from a deep passion for artistic expression and a desire to bring unique, meaningful artwork into people's lives. Founded in the heart of Kathmandu, Nepal, our gallery represents a bridge between traditional artistic techniques and contemporary creative vision.
                </p>
                <p>
                  Every piece in our collection tells a story — a moment captured, an emotion expressed, a vision realized. We believe that art should not just be seen, but felt, experienced, and lived. Our work spans across various mediums including graphite, watercolor, and custom commissioned pieces that transform personal visions into tangible masterpieces.
                </p>
                <p>
                  Whether you're looking for a stunning portrait, a serene landscape, or an abstract piece that speaks to your soul, Duluwa Art Gallery offers curated collections and bespoke services tailored to your unique taste and space.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button
                  className="bg-black text-white hover:bg-red-500 hover:text-white transition-colors"
                  size="lg"
                >
                  <Brush className="mr-2 h-4 w-4" />
                  Commission Artwork
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  View Collections
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-red-100 to-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Palette className="h-32 w-32 mx-auto text-red-500 mb-4" />
                  <p className="text-gray-500 font-medium">Art in Progress</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-500 text-white p-6 rounded-xl shadow-xl">
                <p className="text-3xl font-bold">5+</p>
                <p className="text-sm">Years of Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our Mission & Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Passion for Art",
                desc: "Every piece is created with genuine love and dedication to the craft.",
              },
              {
                icon: Target,
                title: "Customer Vision",
                desc: "We listen, understand, and bring your unique vision to life.",
              },
              {
                icon: Award,
                title: "Quality Excellence",
                desc: "Premium materials and techniques ensure lasting, archival-quality art.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-center">{value.title}</h3>
                    <p className="text-gray-600 text-center">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            What We Offer
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Palette,
                title: "Custom Commissions",
                desc: "Transform your ideas into unique, personalized artwork.",
              },
              {
                icon: Sparkles,
                title: "Portrait Art",
                desc: "Stunning portraits that capture personality and emotion.",
              },
              {
                icon: Brush,
                title: "Landscapes",
                desc: "Beautiful scenic art that brings nature into your space.",
              },
              {
                icon: Users,
                title: "Art Consultation",
                desc: "Expert guidance on selecting the perfect pieces for your space.",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Let's Create Together
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 mb-8"
          >
            Ready to bring your artistic vision to life? Connect with us through social media or reach out directly to discuss your project.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Us
            </Button>
          </motion.div>
        </div>
      </section>

      <GenZGlassyFooter />
    </main>
  );
}
