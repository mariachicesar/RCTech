"use client";

import React from "react";

const PricingSection = () => {
  const websitePlans = [
    {
      name: "Basic Plan",
      price: 750,
      description: "Perfect for small businesses getting started",
      features: [
        "Landing Page and Contact Page",
        "SEO Optimization",
        "Free Website Hosting for 1 year",
        "Free Domain Name for 1 year",
        "1 Custom Feature/Widget",
        "Favicon Design",
        "Mobile Responsive Design",
        "Basic Analytics Setup"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Premium Plan",
      price: 1250,
      description: "Most popular choice for growing businesses",
      features: [
        "Landing Page and Contact Page",
        "4 Service Pages + 5 Location Pages",
        "SEO Optimization",
        "Free Website Hosting for 1 year",
        "Free Domain Name for 1 year",
        "3 Custom Features/Widgets",
        "Favicon Design",
        "Contact Form Integration",
        "Google Analytics & Search Console",
        "Social Media Integration"
      ],
      popular: true,
      buttonText: "Most Popular"
    },
    {
      name: "Business Plan",
      price: 1750,
      description: "Complete solution for established businesses",
      features: [
        "Landing Page and Contact Page",
        "6 Service Pages + 10 Location Pages",
        "Advanced SEO Optimization",
        "Free Website Hosting for 1 year",
        "Free Domain Name for 1 year",
        "5 Custom Features/Widgets",
        "Favicon Design",
        "E-commerce Integration",
        "Advanced Analytics & Reporting",
        "Priority Support",
        "Content Management System"
      ],
      popular: false,
      buttonText: "Go Premium"
    }
  ];

  const monthlyPlans = [
    {
      name: "Basic Plan",
      price: 500,
      description: "Monthly subscription (min 6 months)",
      features: [
        "New Website Landing Page and Contact Form",
        "Set-up Google My Business",
        "1 Website Update Monthly",
        "Google Search Console + Analytics Setup",
        "Monthly Performance Report",
        "6 Service Pages + 10 Location Pages",
        "Free Website Hosting",
        "Free Domain Name",
        "Facebook or Instagram Marketing Setup"
      ],
      popular: false,
      buttonText: "Start Monthly"
    },
    {
      name: "Premium Plan",
      price: 750,
      description: "Monthly subscription (min 6 months)",
      features: [
        "Website Landing Page + Contact Form (email + text)",
        "Google My Business Management (1 post/week)",
        "3 Website Updates Monthly",
        "Advanced Analytics + Monthly Report",
        "6 Service Pages + 5 Location Pages",
        "Free Website Hosting",
        "Free Domain Name",
        "Social Media Marketing",
        "Lead Generation Optimization",
        "Priority Email Support"
      ],
      popular: true,
      buttonText: "Most Popular"
    },
    {
      name: "Business Plan",
      price: 950,
      description: "Monthly subscription (min 6 months)",
      features: [
        "Complete Website + Advanced Contact Forms",
        "Google My Business Management (3 posts/week)",
        "5 Website Updates Monthly",
        "Comprehensive Analytics + Weekly Reports",
        "6 Service Pages + 10 Location Pages",
        "Free Website Hosting",
        "Free Domain Name",
        "Multi-platform Social Media Marketing",
        "Advanced Lead Generation",
        "24/7 Priority Support",
        "Monthly Strategy Consultation"
      ],
      popular: false,
      buttonText: "Go Enterprise"
    }
  ];

  const [activeTab, setActiveTab] = React.useState("website");

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-[#CD7F32]">Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you need a one-time website or ongoing digital marketing support, 
            we have the perfect solution for your business needs.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab("website")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "website"
                    ? "bg-[#CD7F32] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#CD7F32]"
                }`}
              >
                Website Only
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "monthly"
                    ? "bg-[#CD7F32] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#CD7F32]"
                }`}
              >
                Website & Leads
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(activeTab === "website" ? websitePlans : monthlyPlans).map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular
                  ? "border-[#CD7F32] scale-105"
                  : "border-gray-200 hover:border-[#CD7F32]/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#CD7F32] to-[#C41E3A] text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-[#CD7F32]">
                    ${plan.price}
                  </span>
                  {activeTab === "monthly" && (
                    <span className="text-gray-600 ml-2">/month</span>
                  )}
                  {activeTab === "website" && (
                    <span className="text-gray-600 ml-2">one-time</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-[#C41E3A] mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#CD7F32] to-[#C41E3A] text-white hover:shadow-xl"
                      : "bg-gray-100 text-[#CD7F32] hover:bg-[#CD7F32] hover:text-white"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Every business is unique. Let&apos;s discuss your specific needs and create 
              a tailored solution that fits your goals and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#CD7F32] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8B4513] transition-colors duration-300">
                Schedule Consultation
              </button>
              <button className="border-2 border-[#CD7F32] text-[#CD7F32] px-8 py-3 rounded-lg font-semibold hover:bg-[#CD7F32] hover:text-white transition-colors duration-300">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
