import React from "react";

const AboutSection = () => {
  const stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" },
    { value: "5+", label: "Years Experience" }
  ];

  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Reliability",
      description: "We deliver consistent, dependable solutions that you can count on."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: "Quality",
      description: "Every solution is crafted with attention to detail and best practices."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Partnership",
      description: "We become your trusted technology partner, not just a vendor."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Innovation",
      description: "We stay ahead of technology trends to keep your business competitive."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              About <span className="text-[#CD7F32]">RC Tech Bridge</span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                We believe small businesses should spend their time on business strategy, 
                not troubleshooting servers. That&apos;s why RC Tech Bridge exists – to be your 
                reliable technology partner, removing obstacles and creating solutions 
                that work seamlessly behind the scenes.
              </p>
              
              <p>
                Our mission is simple: <span className="text-[#CD7F32] font-semibold">
                bridge the gap between your business goals and technology solutions</span>. 
                We handle the complexity so you can focus on what you do best – 
                growing your business and serving your customers.
              </p>
              
              <p>
                With years of experience in web development, system integration, 
                and business automation, we understand both the technical challenges 
                and business needs that drive success.
              </p>
            </div>

            <div className="mt-8">
              <button className="bg-[#CD7F32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4513] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                Learn Our Story
              </button>
            </div>
          </div>

          {/* Right Column - Visual/Stats */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Our Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-[#CD7F32] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Photo Placeholder */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="bg-gradient-to-r from-[#CD7F32]/10 to-[#C41E3A]/10 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-[#CD7F32]">R</span>
                    <div className="w-8 h-1 bg-[#C41E3A] rounded-full"></div>
                    <span className="text-2xl font-bold text-[#CD7F32]">C</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Building bridges between businesses and technology since 2020
                  </p>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#CD7F32]/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#C41E3A]/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#C41E3A]">Values</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do and ensure we deliver 
            exceptional results for every client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#CD7F32] to-[#C41E3A] rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h4>
              
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
