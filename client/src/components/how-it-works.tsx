import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Join the waitlist today to secure your spot and be the first to experience Quantum."
  },
  {
    number: 2,
    title: "Early Access",
    description: "Waitlist members will receive exclusive early access to the platform before public launch."
  },
  {
    number: 3,
    title: "Transform Your Workflow",
    description: "Experience the future of productivity with our revolutionary platform."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Quantum Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, intuitive workflow that adapts to your team's needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mb-6 relative z-10">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
