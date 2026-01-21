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
  const viewportRef = useRef<HTMLDivElement | null>(null); // Ref for the direct viewport of the carousel

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [carouselWidth, setCarouselWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidths = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth);
      }
      if (viewportRef.current) {
        // Measure the actual container of the motion.div
        setViewportWidth(viewportRef.current.offsetWidth);
      }
    };

    const timeoutId = setTimeout(updateWidths, 100);

    window.addEventListener("resize", updateWidths);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateWidths);
    }
  }, [children]);

  // The transform now uses the more precise viewportWidth
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(carouselWidth - viewportWidth)]
  );

  const height = carouselWidth ? `${carouselWidth}px` : "100vh";

  return (
    <section ref={targetRef} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col">
          {header}
          {/* Add the ref to the direct parent of the motion.div */}
          <div ref={viewportRef} className="flex items-center flex-grow mt-[-4rem]">
            <motion.div ref={carouselRef} style={{ x }} className="flex gap-8">
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

