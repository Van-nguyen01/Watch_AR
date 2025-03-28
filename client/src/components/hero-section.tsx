import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-20 pb-24 hero-gradient" id="hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15 3.414V2.586l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L17 2.586v1.828l.707-.707a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Coming Soon - Join the Waitlist!
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Redefining productivity with 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"> Quantum</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A revolutionary platform designed to help teams collaborate, organize, and achieve more together. Sign up today to be the first to experience it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('waitlist')}
                className="flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition duration-150 ease-in-out"
              >
                Join the Waitlist
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => scrollToSection('how-it-works')}
                className="flex items-center justify-center px-6 py-3.5 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Learn More
              </Button>
            </div>
            <div className="flex items-center mt-8 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
              <span className="mx-2">•</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Early access for waitlist members</span>
            </div>
          </motion.div>
          <motion.div 
            className="hidden md:block relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30"></div>
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="w-full h-72 rounded-t-xl bg-gray-200"></div>
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">Q</div>
                    <h3 className="ml-2 font-semibold">Quantum Dashboard</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
