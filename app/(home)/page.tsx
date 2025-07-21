import { BlogFooter } from "@/components/footer";
import HeroSection from "@/components/hero-section";
import React from "react";

const page = async () => {
  return (
    <main>
      <HeroSection />
      <BlogFooter />
    </main>
  );
};

export default page;
