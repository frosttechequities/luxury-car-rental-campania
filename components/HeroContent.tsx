// components/HeroContent.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DictionaryType, Locale } from '@/lib/dictionary'; // Assuming types are here

interface HeroContentProps {
  dict: DictionaryType;
  lang: Locale;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger animation of children
      delayChildren: 0.3, // Wait a bit before starting children animations
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HeroContent({ dict, lang }: HeroContentProps) {
  return (
    // Use motion.div for the container and apply variants
    <motion.div
      className="hero-content relative z-10 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Trigger animation on mount
    >
      {/* Wrap each child in motion.div and apply item variants */}
      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 !text-white drop-shadow-md"
        variants={itemVariants}
      >
        {dict.homepage.hero_title}
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl mb-8 !text-gray-200 drop-shadow-sm"
        variants={itemVariants}
      >
        {dict.homepage.hero_subtitle}
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link
          href={`/${lang}/#services`}
          className="cta-button inline-block bg-hl-blue hover:bg-hl-dark-blue text-white font-bold text-lg py-3 px-8 rounded transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          {dict.homepage.cta_button}
        </Link>
      </motion.div>
    </motion.div>
  );
}