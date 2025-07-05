import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-yellow-900 text-white pt-18 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand Information */}
          <div className="flex gap-4">
            <img src="/icons/IdeaNestLogo.webp" className="size-12" alt="" />
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">Idea Nest</h1>
              <p className="text-sm">Crafting excellence since 2025</p>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/home" className="!text-white transition-colors">
              Home
            </Link>
            <Link href="#" className="!text-white transition-colors">
              About
            </Link>
            <Link href="#" className="!text-white transition-colors">
              Services
            </Link>
            <Link href="#" className="!text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        {/* Copyright Section */}
        <div className="mt-18 text-center text-sm">
          © {new Date().getFullYear()} Idea Nest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
