
import { Check, Sparkles, Shield, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="max-w-xl mx-auto lg:mx-0">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold text-sm">Premium Business Solutions</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Premium Business
                </span>
                <br />
                <span className="text-gray-900">Solutions</span>{' '}
                <span className="text-gray-700">for</span>
                <br />
                <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Enterprise Growth
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Unlock exclusive access to top-tier professionals, priority support, 
                and advanced project management tools designed for serious businesses.
              </p>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-100/50 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-800">Priority Support</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-100/50 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-800">Dedicated Account Manager</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-100/50 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-800">Advanced Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              {/* Stats Cards - Positioned above the image but maintaining their relative positions */}
              <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-100/50 animate-fade-in z-20" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-100/50 animate-fade-in z-20" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">100+</div>
                    <div className="text-sm text-gray-600">Enterprise Clients</div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://skilllink.africa/assets/image2-i9v8WTA1.png" 
                  alt="Premium Business Solutions" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
