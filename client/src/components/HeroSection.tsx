import { motion } from "framer-motion";
import { GradientText } from "./ui/gradient-text";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const offsetPosition = element?.offsetTop ?? 0;
    const headerHeight = 80;
    
    window.scrollTo({
      top: offsetPosition - headerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px),radial-gradient(#6366f1_0.5px,#ffffff_0.5px)] bg-[length:20px_20px] bg-[0_0,10px_10px] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Revolutionize Your <GradientText>Workflow</GradientText> Experience
          </h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The all-in-one platform designed to streamline your productivity. 
            Join thousands waiting to transform their daily tasks.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              className="w-full sm:w-auto px-8 py-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:shadow-xl transition-all hover:-translate-y-1"
              size="lg"
              onClick={() => scrollToSection("waitlist")}
            >
              Join the Waitlist
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 bg-white text-primary hover:border-primary/30 hover:shadow transition-all hover:-translate-y-1"
              size="lg"
              onClick={() => scrollToSection("features")}
            >
              Explore Features
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 md:mt-20 relative max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-[float_6s_ease-in-out_infinite]">
            <div className="aspect-video bg-gray-200 w-full"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto -mt-8 relative z-10">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5000+</div>
              <div className="text-sm text-gray-600">Waitlist Signups</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform">
              <div className="text-2xl md:text-3xl font-bold text-purple-500 mb-1">98%</div>
              <div className="text-sm text-gray-600">User Satisfaction</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-1">Q2 2023</div>
              <div className="text-sm text-gray-600">Launch Date</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
