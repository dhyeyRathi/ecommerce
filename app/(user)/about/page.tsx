import React from "react";
import { Shield, Sparkles, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-background pt-28 pb-16 px-4 md:px-8 lg:px-16 text-heading flex justify-center items-center">
      <div className="max-w-4xl w-full flex flex-col gap-10">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">About EZMart</h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            We are dedicated to building the easiest, most reliable e-commerce shopping experience. Bringing quality products directly to your doorstep.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs hover:border-primary/20 transition-all duration-200 flex flex-col gap-4 text-center items-center">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Our Mission</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              To simplify online shopping by providing a fast, modern platform filled with items you love, without any of the complexity.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs hover:border-primary/20 transition-all duration-200 flex flex-col gap-4 text-center items-center">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Our Integrity</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              We verify and source high-quality products, maintaining strict safety, transaction reliability, and privacy standards.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs hover:border-primary/20 transition-all duration-200 flex flex-col gap-4 text-center items-center">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Our Commitment</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              A customer-first culture focused on responsive support, fast delivery timelines, and convenient return options.
            </p>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-2xl p-8 shadow-2xs text-center space-y-4">
          <h2 className="text-2xl font-bold">Simple, Clean, Easy</h2>
          <p className="text-text max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            E-commerce shouldn't be complicated. That's why we focus on high performance, secure checkout pipelines, and a seamless interface.
          </p>
        </section>
      </div>
    </div>
  );
}
