"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";
import { useNotification } from "@/app/context/notificationContext";

const Footer = () => {
  const { showToast } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    // Mimic API newsletter subscription
    await new Promise((resolve) => setTimeout(resolve, 800));
    showToast("Subscribed successfully! Thank you for joining EZ Mart.", "success");
    setEmail("");
    setLoading(false);
  };

  const shopLinks = [
    { name: "Products Catalogue", path: "/products" },
    { name: "Shopping Cart", path: "/cart" },
    { name: "My Wishlist", path: "/wishlist" },
  ];

  const userLinks = [
    { name: "Personal Profile", path: "/profile" },
    { name: "Order History", path: "/myorders" },
    { name: "Account Settings", path: "/settings" },
  ];

  const legalLinks = [
    { name: "Customer Support", path: "/settings" },
    { name: "Privacy Policy", path: "/settings" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <footer className="w-full bg-heading text-background font-sans pt-20 pb-12 px-4 sm:px-8 md:px-14 lg:px-20 border-t border-border/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-border/10">
        {/* Brand Section */}
        <div className="flex flex-col space-y-6">
          <Link href="/" prefetch={false} className="inline-flex items-center gap-2 group">
            <span className="text-primary font-bold text-2xl tracking-[0.2em] group-hover:text-primary-hover transition-colors font-heading">
              - EZ
            </span>
            <span className="text-white text-2xl tracking-[0.2em] font-heading font-light">
              MART
            </span>
          </Link>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Your destination for premium products, smooth checkout experiences, and dedicated client assistance.
          </p>
          <div className="flex gap-4">
            {/* Social Icons / placeholders can go here */}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-white tracking-wider font-heading">
            Stay in the Loop
          </h3>
          <p className="text-text-muted text-xs leading-relaxed">
            Subscribe to receive product notifications, weekly curations, and exclusive promotional updates.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center mt-2 border-b border-border/30 pb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="bg-transparent text-white placeholder-text-muted/60 text-xs w-full focus:outline-none pr-10 tracking-widest font-semibold uppercase"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-0 hover:text-primary transition-colors text-text-muted cursor-pointer"
              aria-label="Subscribe"
            >
              <Send className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
            </button>
          </form>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 gap-8 lg:col-span-2">
          {/* Shop & Account */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">
              Shop & Account
            </h4>
            <ul className="space-y-3">
              {[...shopLinks, ...userLinks].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    prefetch={false}
                    className="text-text-muted hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">
              Help & Support
            </h4>
            <ul className="space-y-3 mb-6">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    prefetch={false}
                    className="text-text-muted hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Direct contact details inside help */}
            <div className="space-y-2 pt-2 border-t border-border/10 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>+91 000 111 999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="lowercase">contact@ezmart.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>99, ABC Street, PQR City, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
        <p>© {new Date().getFullYear()} EZ Mart Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/settings" prefetch={false} className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/settings" prefetch={false} className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/settings" prefetch={false} className="hover:text-white transition-colors">
            Cookie Preferences
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
