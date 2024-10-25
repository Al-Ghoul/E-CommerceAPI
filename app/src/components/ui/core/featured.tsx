import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Featured() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={`/placeholder.svg?height=350&width=350`}
                alt="Product Image"
                className="object-cover w-full h-60"
                width={350}
                height={350}
              />
              <div className="p-4 bg-white dark:bg-gray-950">
                <h3 className="font-semibold text-lg mb-2">Product Name</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Short product description goes here.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold">$99.99</span>
                  <Button size="sm">Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline">
            View All Products
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
