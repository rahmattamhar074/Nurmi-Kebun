"use client";

import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface AnimatedGridPatternProps
  extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

/**
 * Helper to get a random position within dimensions
 */
const getPos = (
  width: number,
  height: number,
  tileWidth: number,
  tileHeight: number
) => {
  return [
    Math.floor((Math.random() * width) / tileWidth),
    Math.floor((Math.random() * height) / tileHeight),
  ];
};

/**
 * Helper to generate initial squares
 */
const generateSquares = (
  count: number,
  width: number,
  height: number,
  tileWidth: number,
  tileHeight: number
) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: getPos(width, height, tileWidth, tileHeight),
  }));
};

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<{ id: number; pos: number[] }[]>([]);

  // Function to update a single square's position
  // wrapped in useCallback to keep it stable
  const updateSquarePosition = useCallback(
    (id: number) => {
      setSquares((currentSquares) =>
        currentSquares.map((sq) =>
          sq.id === id
            ? {
                ...sq,
                pos: getPos(dimensions.width, dimensions.height, width, height),
              }
            : sq
        )
      );
    },
    [dimensions.width, dimensions.height, width, height]
  );

  // Update squares when dimensions or numSquares change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(
        generateSquares(
          numSquares,
          dimensions.width,
          dimensions.height,
          width,
          height
        )
      );
    }
  }, [dimensions.width, dimensions.height, numSquares, width, height]);

  // Resize observer to update container dimensions
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={twMerge(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [xPos, yPos], id: squareId }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(squareId)}
            // Stable key based on original ID to prevent unmounting/remounting
            // during position updates. This keeps the animation cycle fluid.
            key={`${squareId}`}
            width={width - 1}
            height={height - 1}
            x={xPos * width + 1}
            y={yPos * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
