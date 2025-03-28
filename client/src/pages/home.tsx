import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FaqSection from "@/components/faq-section";
import WaitlistForm from "@/components/waitlist-form";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Get waitlist count for stats section
  const { data: waitlistStats } = useQuery({
    queryKey: ['/api/waitlist/count'],
    staleTime: 60000, // 1 minute
  });
  
  const waitlistCount = waitlistStats?.count || "2,500+";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection waitlistCount={waitlistCount} />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <FaqSection />
        <section id="waitlist" className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Waitlist</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Be the first to experience Quantum and transform your team's productivity.
              </p>
            </div>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-8">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
