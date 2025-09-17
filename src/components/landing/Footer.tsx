import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Web Development", href: "#services" },
      { name: "System Integration", href: "#services" },
      { name: "Technical Support", href: "#services" },
      { name: "Business Automation", href: "#services" },
      { name: "Digital Transformation", href: "#services" },
      { name: "Consulting", href: "#services" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Process", href: "#about" },
      { name: "Case Studies", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#contact" }
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "System Status", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" }
    ]
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61563439975837",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.349-1.052-2.349-2.349 0-1.297 1.052-2.349 2.349-2.349 1.297 0 2.349 1.052 2.349 2.349 0 1.297-1.052 2.349-2.349 2.349zm7.138 0c-1.297 0-2.349-1.052-2.349-2.349 0-1.297 1.052-2.349 2.349-2.349 1.297 0 2.349 1.052 2.349 2.349 0 1.297-1.052 2.349-2.349 2.349z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#8B4513] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-[#DEB887]">R</span>
                  <div className="w-6 h-0.5 bg-[#C41E3A] rounded-full"></div>
                  <span className="text-2xl font-bold text-[#DEB887]">C</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[#DEB887] font-bold text-sm tracking-wide">TECH</span>
                  <span className="text-[#C41E3A] font-bold text-sm tracking-wide -mt-1">BRIDGE</span>
                </div>
              </Link>
              
              <p className="text-[#DEB887] mb-6 max-w-md leading-relaxed">
                Bridging the gap between your business goals and technology solutions. 
                We handle the complexity so you can focus on growth.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-[#DEB887]">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <a href="mailto:info@rctechbridge.com" className="hover:text-white transition-colors">
                    info@rctechbridge.com
                  </a>
                </div>
                <div className="flex items-center text-[#DEB887]">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <a href="tel:+1-626-922-0091" className="hover:text-white transition-colors">
                    (626) 922-0091
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-[#CD7F32] rounded-lg flex items-center justify-center text-white hover:bg-[#C41E3A] transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-[#DEB887] hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-[#DEB887] hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-[#CD7F32] py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-[#DEB887]">
                Get the latest insights on business technology trends.
              </p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] text-gray-900"
              />
              <button className="bg-[#C41E3A] text-white px-6 py-3 rounded-r-lg hover:bg-[#8B0000] transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#CD7F32] py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-[#DEB887] text-sm mb-4 md:mb-0">
              © {currentYear} RC Tech Bridge. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              {footerLinks.support.slice(3).map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="text-[#DEB887] hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
