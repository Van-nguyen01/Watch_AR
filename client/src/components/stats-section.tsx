import { motion } from "framer-motion";

interface StatsProps {
  waitlistCount: string | number;
}

export default function StatsSection({ waitlistCount }: StatsProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-primary">{waitlistCount}</p>
            <p className="text-gray-600 mt-2">Waitlist Members</p>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-primary">99%</p>
            <p className="text-gray-600 mt-2">Satisfaction Score</p>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-primary">15+</p>
            <p className="text-gray-600 mt-2">Integrations</p>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
            <p className="text-gray-600 mt-2">Support</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
