import AppLayout from "@/layouts/app-layout";

import { Head } from "@inertiajs/react";
import TestimonialCarousel from "./components/testimonial-carousel";
import ProductHighlight from "./components/product-highlight";
import ProductAnchor from "./components/product-anchor";
import FAQSection from "./components/faq-section";
import { Link } from "@/components/ui/link";
import HeroSection from "./components/hero";
import { IconBrandWhatsapp } from "@intentui/icons";
import { AnimatedGridPattern } from "@/components/animated-tiles";
import type { Product } from "@/types/product";

interface HomeProps {
  bestSellingProducts: Product[];
}

export default function Home({ bestSellingProducts }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <div className="space-y-4 overflow-x-hidden">
        <HeroSection />
        <ProductAnchor />
        <ProductHighlight products={bestSellingProducts} />
        <FAQSection />
        <TestimonialCarousel />
        <div className="rounded-xl  lg:aspect-[3/1] bg-emerald-800 my-16 lg:my-32 overflow-hidden relative">
          <AnimatedGridPattern />
          <div className="h-full flex flex-col lg:flex-row items-center justify-between gap-4 p-6 lg:p-12">
            <div className="space-y-8 lg:space-y-4 max-w-xl flex-shrink-0">
              <p className="text-white text-3xl lg:text-5xl font-semibold">
                Have questions about plant care?
              </p>
              <p className="text-white/80">
                Our plant experts are here to help! Get personalized advice on
                choosing the right plants, care instructions, and
                troubleshooting tips via WhatsApp.
              </p>
              <Link href="https://wa.me/6281348151616" target="_blank">
                <div className="px-4 py-2.5 text-lg rounded-full bg-primary text-white w-fit font-medium  flex gap-x-2 items-center">
                  <IconBrandWhatsapp className="w-6 h-6" />
                  Contact Us
                </div>
              </Link>
            </div>
            <div className="flex-shrink min-w-0 max-w-xs lg:max-w-md h-32 lg:h-full hidden lg:block">
              <img
                src="/assets/whatsapp-1.png"
                alt="WhatsApp by icons8"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Home.layout = (page: any) => <AppLayout children={page} />;
