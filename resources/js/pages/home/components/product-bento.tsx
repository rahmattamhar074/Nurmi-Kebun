import { IconGrid4, IconStar, IconTruck } from "@intentui/icons";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-aria-components";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ProductBento = () => {
  const bentoRef = useRef(null);
  const isBentoInView = useInView(bentoRef, { once: true, amount: 0.2 });

  return (
    <div ref={bentoRef} className="py-8 lg:py-16">
      <div className="grid grid-cols-12 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={
            isBentoInView
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.8, rotate: -5 }
          }
          transition={{
            duration: 0.8,
            ease: [0.33, 1, 0.68, 1],
            delay: 0.1,
          }}
          className="lg:col-span-4 col-span-12 bg-neutral-100 dark:bg-neutral-200 aspect-square lg:aspect-auto rounded-lg relative overflow-hidden"
        >
          <div className="absolute left-0 bottom-0 translate-y-1/4 translate-x-1/4">
            <img
              alt="plant-1 from pngtree.com"
              src="/assets/images/plant-1.webp"
              loading="lazy"
              className="w-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-800 opacity-10"></div>
          <div className="z-4 absolute inset-0 p-4 lg:p-8 flex flex-col justify-between">
            <h3 className="text-4xl lg:text-5xl font-bold leading-tight text-black">
              <span className="italic">Premium</span> Plant Collection
            </h3>
            <Link href="/store">
              <div className="px-4 py-2 text-lg rounded-full border border-black  w-fit font-medium text-black flex gap-x-2 items-center">
                Shop Now
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-8 col-span-12 grid grid-cols-12 gap-4 lg:aspect-video">
          {/* Seamless Access - Slide from Right */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={
              isBentoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
            }
            transition={{
              duration: 0.7,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.2,
            }}
            className="col-span-12 bg-gradient-to-br from-emerald-600 to-emerald-800 aspect-auto lg:aspect-[3/1] rounded-lg relative"
          >
            <div className="flex flex-col lg:flex-row gap-y-5 justify-start lg:justify-between w-full h-full p-4 lg:p-8">
              <div className="flex justify-between flex-col space-y-8">
                <div className="flex-1 space-y-2">
                  <h3 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
                    Seamless Access
                  </h3>
                  <p className="text-sm text-white/80 max-w-lg">
                    We made our product, easily accessible to you. You can shop
                    our products from the comfort of your home.
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconGrid4 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Payment</p>
                      <p className="font-semibold text-white">
                        Multiple Payment Options
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconTruck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Shipment</p>
                      <p className="font-semibold text-white">
                        Nation-wide shipment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right-0 h-full inset-y-0 hidden lg:block">
                <video
                  src="/assets/animated-shipment.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="h-full object-contain"
                ></video>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isBentoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{
              duration: 0.7,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.3,
            }}
            className="col-span-12 lg:col-span-7 bg-gray-200 aspect-video lg:aspect-auto rounded-lg overflow-hidden relative"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1508175688576-0c076b47b5b5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Eco-friendly plants"
                loading="lazy"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 p-4 lg:p-8 flex flex-col justify-between ">
              <p className="text-white/80 text-sm">
                We support sustainable practices to ensure that our products are
                eco-friendly and environmentally friendly.
              </p>
              <div className="backdrop-blur-sm rounded-lg bg-white/10 flex justify-center p-2 h-fit w-fit items-center gap-x-2">
                <GlobeAltIcon className="size-6 text-white" />
                <p className="text-xl text-white font-medium">
                  <span className="italic">Eco-Friendly</span> Process
                </p>
              </div>
            </div>
          </motion.div>

          {/* Review - Bounce Pop Up */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={
              isBentoInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 80, scale: 0.9 }
            }
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1], // Bounce easing
              delay: 0.4,
            }}
            className="col-span-12 lg:col-span-5 bg-neutral-100 dark:bg-neutral-800 aspect-video lg:aspect-[3/2] rounded-lg relative"
          >
            <div className="px-2 rounded-full border border-black dark:border-neutral-400 w-fit text-sm font-medium absolute left-4 top-4">
              Review
            </div>
            <div className="flex flex-col relative p-4 lg:p-8 w-full h-full justify-between items-center">
              <div className="flex items-center flex-1 gap-2">
                <div className="text-6xl lg:text-7xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  4.9
                </div>
                <IconStar className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-center dark:text-neutral-200 text-neutral-800">
                  "Exceptional quality, sustainable practices, minimal
                  environmental impact."
                </p>
                <div className="flex items-center justify-center -space-x-2">
                  {["SH", "AB", "CN"].map((item) => (
                    <Avatar
                      initials={item}
                      key={item}
                      className="size-8 dark:ring-zinc-900 bg-neutral-50 dark:bg-neutral-800"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductBento;
