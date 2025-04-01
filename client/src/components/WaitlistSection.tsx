import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-20 bg-gradient-to-r from-primary to-purple-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Waitlist</h2>
          <p className="text-lg md:text-xl text-white/90">Be among the first to experience our revolutionary product.</p>
        </div>
        
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
