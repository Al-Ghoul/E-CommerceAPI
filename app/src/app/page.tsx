"use client";
import { Button } from "@/components/ui/button";
import { Featured } from "@/components/ui/core/featured";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{
        opacity: 0,
        y: 50,
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to our E-Commerce Store
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover our wide range of products. From electronics to
                fashion, we&apos;ve got you covered.
              </p>
            </div>
            <div className="space-x-4">
              <Button>Shop Now</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
      <Featured />
    </motion.div>
  );
}
