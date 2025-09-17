"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-[#CD7F32]">R</span>
              <div className="w-6 h-0.5 bg-[#C41E3A] rounded-full"></div>
              <span className="text-2xl font-bold text-[#CD7F32]">C</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#CD7F32] font-bold text-sm tracking-wide">TECH</span>
              <span className="text-[#C41E3A] font-bold text-sm tracking-wide -mt-1">BRIDGE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-gray-700 hover:text-[#CD7F32] transition-colors font-medium">
              Home
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-[#CD7F32] transition-colors font-medium">
              Services
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-[#CD7F32] transition-colors font-medium">
              About
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-[#CD7F32] transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-[#CD7F32] transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/signin?next=/admin"
              className="text-[#CD7F32] border border-[#CD7F32] px-4 py-2 rounded-lg font-semibold hover:bg-[#CD7F32] hover:text-white transition-all duration-300"
            >
              Admin Login
            </Link>
            <Link 
              href="#contact"
              className="bg-[#CD7F32] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#8B4513] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#CD7F32] focus:outline-none focus:text-[#CD7F32]"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="#home" 
                className="block px-3 py-2 text-gray-700 hover:text-[#CD7F32] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="#services" 
                className="block px-3 py-2 text-gray-700 hover:text-[#CD7F32] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="#about" 
                className="block px-3 py-2 text-gray-700 hover:text-[#CD7F32] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="#pricing" 
                className="block px-3 py-2 text-gray-700 hover:text-[#CD7F32] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="#contact" 
                className="block px-3 py-2 text-gray-700 hover:text-[#CD7F32] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Link 
                  href="/signin?next=/admin"
                  className="block w-full text-center border border-[#CD7F32] text-[#CD7F32] px-4 py-2 rounded-lg font-semibold hover:bg-[#CD7F32] hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link 
                  href="#contact"
                  className="block w-full text-center bg-[#CD7F32] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8B4513] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
