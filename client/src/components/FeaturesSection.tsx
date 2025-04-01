import { 
  Zap, 
  ShieldCheck, 
  Paintbrush, 
  BarChart, 
  Clock, 
  Users 
} from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Lightning Fast",
    description: "Experience millisecond response times and seamless performance across all devices."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Bank-Level Security",
    description: "End-to-end encryption ensures your data remains private and secure at all times."
  },
  {
    icon: <Paintbrush className="h-6 w-6 text-primary" />,
    title: "Customizable Interface",
    description: "Adapt the platform to your specific needs with our flexible and intuitive customization tools."
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: "Real-time Analytics",
    description: "Get powerful insights into your productivity patterns with detailed analytics dashboards."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Time Tracking",
    description: "Effortlessly track time spent on tasks and projects with automated tracking features."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Team Collaboration",
    description: "Seamlessly work together with teammates using integrated collaboration tools."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600">Designed to elevate your productivity and simplify your workflow.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
