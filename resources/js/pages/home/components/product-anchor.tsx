import TextMask from "@/components/text-mask";
import ProductBento from "./product-bento";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ProductAnchor = () => {
  const firstParagraphRef = useRef(null);
  const secondParagraphRef = useRef(null);
  const isFirstParagraphInView = useInView(firstParagraphRef, {
    once: true,
    amount: 0.5,
  });
  const isSecondParagraphInView = useInView(secondParagraphRef, {
    once: true,
    amount: 0.5,
  });

  return (
    <section id="anchor" className=" space-y-4 lg:space-y-8 py-16 scroll-m-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:items-end">
        <div>
          <div>
            <TextMask className="text-4xl lg:text-6xl font-medium">
              Grow Your Green Space, Efficiently
            </TextMask>
          </div>
        </div>
        <div className="space-y-4 leading-relaxed text-neutral-600 text-sm lg:text-base dark:text-neutral-300">
          <motion.p
            ref={firstParagraphRef}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isFirstParagraphInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 50 }
            }
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.1,
            }}
          >
            At Sari Amuntai Plant Shop, we believe in nurturing growth—not just
            for plants, but for our community and environment. We source our
            plants from local growers who share our commitment to sustainable
            practices, ensuring every plant you bring home is healthy, ethically
            grown, and ready to thrive.
          </motion.p>
          <motion.p
            ref={secondParagraphRef}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isSecondParagraphInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 50 }
            }
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.2,
            }}
          >
            Whether you're a seasoned gardener or just starting your green
            journey, we're here to support you every step of the way. From
            selecting the perfect plant for your space to providing ongoing care
            guidance, our mission is to help you cultivate a deeper connection
            with nature while beautifying your home.
          </motion.p>
        </div>
      </div>
      <ProductBento />
    </section>
  );
};

export default ProductAnchor;
