"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const HeroSection = () => {
  const imageRef = useRef(null);
  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
    };
    // Always start with tilt (remove scrolled class on mount)
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section className="w-full pt-12 md:pt-16 pb-8 text-white">
      <div className="space-y-6 text-center container mx-auto px-4">
        {/* Headline */}
        <div className="space-y-6 hero-content">
          <div className="hero-title">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
              Welcome to WatshiBo
              <br />
              <span className="metallic-blue">
                Your Ultimate AI-Powered Study Companion
              </span>
            </h1>
          </div>
          <div className="hero-subtitle">
            <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
              Elevate your learning experience with WatshiBo, 
              the AI-driven platform designed to assist students 
              in mastering complex subjects. Whether you're 
              tackling challenging concepts or seeking 
              personalized study support, WatshiBo is here to help you succeed.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 hero-buttons">
          <Button 
            asChild 
            size="lg" 
            className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button 
            asChild 
            size="lg" 
            className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg" 
            variant="outline"
          >
            <Link href="/dashboard">Learn More</Link>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
          <Image
            src="/banner1.png"
            alt="Hero Image"
            width={1280}
            height={720}
            className="rounded-lg shadow-xl border mx-auto"
            priority
          />
        </div></div>
      </div>
    </section>
  );
};

export default HeroSection;