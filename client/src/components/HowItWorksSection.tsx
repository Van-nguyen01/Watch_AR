import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple, intuitive, and designed for maximum productivity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">1</div>
            <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
            <p className="text-gray-600">Join our waitlist to be among the first to access our platform when we launch.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">2</div>
            <h3 className="text-xl font-semibold mb-3">Receive Invitation</h3>
            <p className="text-gray-600">Get early access to set up your personalized workspace with custom preferences.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">3</div>
            <h3 className="text-xl font-semibold mb-3">Transform Your Work</h3>
            <p className="text-gray-600">Start experiencing the benefits of an optimized workflow immediately.</p>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 bg-gray-800 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">See it in action</h3>
              <p className="text-gray-300">Watch how ProductName transforms your daily workflow</p>
            </div>
            <div className="relative h-64 md:h-96 bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:scale-105 transform transition-transform p-0"
                >
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
