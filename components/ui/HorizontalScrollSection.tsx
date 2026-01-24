"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useLayoutEffect, ReactNode, useEffect } from "react";

interface HorizontalScrollSectionProps {
  children: ReactNode[] | ReactNode;
  header: ReactNode;
}

export const HorizontalScrollSection = ({ children, header }: HorizontalScrollSectionProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [carouselWidth, setCarouselWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useLayoutEffect(() => {
    const updateWidths = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth);
      }
      if (viewportRef.current) {
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

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(carouselWidth - viewportWidth)]
  );

  const height = carouselWidth ? `${carouselWidth}px` : "100vh";

  if (isMobile) {
    return (
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {header}
          <div className="mt-4 sm:mt-6 grid gap-6">
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={targetRef} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col">
          {header}
          <div ref={viewportRef} className="flex items-center flex-grow mt-0 lg:mt-[-4rem]">
            <motion.div ref={carouselRef} style={{ x }} className="flex gap-8">
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
