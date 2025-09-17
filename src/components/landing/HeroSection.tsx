"use client";

import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-[#CD7F32]">Bridging</span> Business &{" "}
              <span className="text-[#C41E3A]">Technology</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Focus on growing your business while we handle all the technical obstacles. 
              RC Tech Bridge provides seamless technology solutions that work behind the scenes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="#contact"
                className="bg-[#CD7F32] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4513] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                Get Started Today
              </Link>
              <Link 
                href="#services"
                className="border-2 border-[#CD7F32] text-[#CD7F32] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#CD7F32] hover:text-white transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by growing businesses</p>
              <div className="flex items-center justify-center lg:justify-start space-x-8 text-gray-400">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-600">Projects</div>
                  <div>Completed</div>
                </div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-600">Client</div>
                  <div>Satisfaction</div>
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-600">Technical</div>
                  <div>Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Hero Illustration - Tech Bridge Concept */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  {/* Business Side */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Your Business Focus</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Customer Growth</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Revenue Increase</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Market Expansion</span>
                      </div>
                    </div>
                  </div>

                  {/* Bridge Connection */}
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-[#CD7F32]">R</span>
                      <div className="w-12 h-1 bg-[#C41E3A] rounded-full"></div>
                      <span className="text-3xl font-bold text-[#CD7F32]">C</span>
                    </div>
                  </div>

                  {/* Technology Side */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">We Handle Tech</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#CD7F32] rounded-full"></div>
                        <span className="text-sm text-gray-600">Web Development</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#CD7F32] rounded-full"></div>
                        <span className="text-sm text-gray-600">System Integration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#CD7F32] rounded-full"></div>
                        <span className="text-sm text-gray-600">Technical Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-[#CD7F32]/20 to-[#C41E3A]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
