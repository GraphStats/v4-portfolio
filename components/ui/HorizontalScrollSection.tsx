"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useLayoutEffect, ReactNode } from "react";

interface HorizontalScrollSectionProps {
  children: ReactNode[];
  header: ReactNode;
}

export const HorizontalScrollSection = ({ children, header }: HorizontalScrollSectionProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [carouselWidth, setCarouselWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidths = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth);
      }
      if (targetRef.current) {
        setContainerWidth(targetRef.current.offsetWidth);
      }
    };

    // A slight delay can sometimes help ensure all children have rendered
    // before we take measurements, especially if they are image-heavy.
    const timeoutId = setTimeout(updateWidths, 100);

    window.addEventListener("resize", updateWidths);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateWidths);
    }
  }, [children]); // Rerun if children change

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    // We add a small buffer (e.g., 50px) to ensure the last card can be fully seen
    [0, -(carouselWidth - containerWidth + 50)]
  );

  // The height is the key. Making it equal to the carousel's scrollable distance
  // is what creates the "lock" effect. We add a small amount of extra height
  // to ensure the animation can complete smoothly.
  const height = carouselWidth ? `${carouselWidth}px` : "100vh";

  return (
    <section ref={targetRef} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col">
          {header}
          <div className="flex items-center flex-grow mt-[-8rem]">
            <motion.div ref={carouselRef} style={{ x }} className="flex gap-8">
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};