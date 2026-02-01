import { motion, useInView } from "motion/react";
import { useRef } from "react";

type TextMaskProps = {
  children: string;
  className?: string;
  alignCenter?: boolean;
};

export default function TextMask({
  children,
  className = "",
  alignCenter = false,
}: TextMaskProps) {
  const body = useRef(null);
  const isInView = useInView(body, { once: true, amount: 0.1 });

  const words = children.split(" ");

  return (
    <div className={className} ref={body}>
      <div
        className={
          alignCenter
            ? "flex flex-wrap justify-center"
            : "flex flex-wrap justify-start"
        }
      >
        {words.map((word, index) => (
          <div className="mr-2 overflow-hidden last:mr-0" key={index}>
            <motion.span
              animate={isInView ? { y: "0%" } : { y: "100%" }}
              className="inline-block"
              initial={{ y: "100%" }}
              transition={{
                duration: 0.75,
                ease: [0.33, 1, 0.68, 1],
                delay: 0.05 * index,
              }}
            >
              {word}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
