import TextMask from "@/components/text-mask";
import {
  IconChevronDoubleDown,
  IconCircleCheckFill,
  IconGlobe,
  IconShoppingBagFill,
} from "@intentui/icons";
import { Link } from "react-aria-components";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const upsellPoints = [
  {
    title: "Locally Sourced",
    description: "Supporting local farmers and artisans",
  },
  {
    title: "Expert Care Guidance",
    description: "Free plant care tips with every purchase",
  },
  {
    title: "One Stop Shop",
    description: "All your gardening needs in one place",
  },
  {
    title: "Fast Delivery",
    description: "Same-day delivery for local orders",
  },
];

const HeroSection = () => {
  const buttonsRef = useRef(null);
  const upsellRef = useRef(null);
  const isButtonsInView = useInView(buttonsRef, { once: true, amount: 0.3 });
  const isUpsellInView = useInView(upsellRef, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();

  return (
    <div className="box-border lg:min-h-screen mt-16">
      <div className="rounded-lg bg-primary  overflow-hidden relative h-auto">
        <img
          src={"/assets/images/hero-background.webp"}
          alt="hero-bg"
          className="absolute inset-0 object-cover w-full h-full min-h-[600px] lg:min-h-[700px] selectnone"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        <div className="relative p-4 lg:p-12 flex flex-col justify-between gap-y-16 min-h-[600px] lg:min-h-[700px] py-8 lg:py-16">
          <div className="w-full lg:text-center flex flex-col gap-y-4 lg:gap-y-8">
            <div className="w-fit lg:mx-auto px-4 py-2.5 rounded-full backdrop-blur-sm bg-white/10  mt-8 lg:mt-16 text-emerald-100 text-sm flex items-center gap-x-2">
              <IconGlobe className="size-5" />
              Plant Store at your fingertips
            </div>
            <TextMask
              className="text-3xl lg:text-6xl font-bold leading-tight max-w-3xl lg:mx-auto text-white"
              alignCenter={!isMobile}
            >
              Bring Nature Home with Our Curated Plant Collection
            </TextMask>
            <TextMask
              className="max-w-2xl mx-auto lg:text-lg text-white/80 font-medium"
              alignCenter={!isMobile}
            >
              Transform your living space with beautiful decorative plants,
              premium fertilizers, and expert gardening supplies. Everything you
              need to create your own green sanctuary.
            </TextMask>
            <div ref={buttonsRef} className="flex lg:justify-center gap-x-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isButtonsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  ease: [0.33, 1, 0.68, 1],
                  delay: 0.1,
                }}
              >
                <Link href="#anchor">
                  <div className="px-4 py-2 lg:text-lg rounded-full bg-primary text-white w-fit font-medium flex gap-x-2 items-center ">
                    Discover
                    <IconChevronDoubleDown className="w-6 h-6" />
                  </div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isButtonsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  ease: [0.33, 1, 0.68, 1],
                  delay: 0.2,
                }}
              >
                <Link href="/store">
                  <div className="px-4 py-2 lg:text-lg rounded-full border-2 border-white text-white w-fit font-medium flex gap-x-2 items-center">
                    Explore
                    <IconShoppingBagFill className="w-6 h-6" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
          <div
            ref={upsellRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {upsellPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isUpsellInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  ease: [0.33, 1, 0.68, 1],
                  delay: 0.1 * index,
                }}
                className="rounded-lg bg-primary/10 p-4 lg:p-6 backdrop-blur-sm text-white"
              >
                <div className="flex gap-x-2 items-center">
                  <p className="font-bold">{point.title}</p>
                  <IconCircleCheckFill className="size-5 text-primary" />
                </div>
                <p className="text-xs lg:text-sm text-neutral-200">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
