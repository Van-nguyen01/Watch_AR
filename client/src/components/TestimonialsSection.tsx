import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  position: string;
  content: string;
  stars: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah J.",
    position: "Marketing Director",
    content: "This product has dramatically streamlined our workflow. The intuitive interface makes it easy for our entire team to collaborate seamlessly.",
    stars: 5
  },
  {
    name: "Michael T.",
    position: "Product Manager",
    content: "The analytics features alone are worth the price. We've gained incredible insights into our processes and identified several opportunities for improvement.",
    stars: 5
  },
  {
    name: "Olivia R.",
    position: "Startup Founder",
    content: "As a startup founder, I need tools that grow with my business. This solution offers the perfect blend of simplicity and scalability.",
    stars: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Early Beta Feedback</h2>
          <p className="text-lg text-gray-600">Here's what our early testers are saying</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{testimonial.content}</p>
              <div className="flex text-yellow-400">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
