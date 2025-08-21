import { motion } from "framer-motion";
import { Target, User, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: "Clear and precise",
    description: "Porttitor ante feugiat vitae quam consectetur nunc."
  },
  {
    icon: User,
    title: "Personalized answers", 
    description: "Porttitor ante feugiat vitae quam consectetur nunc."
  },
  {
    icon: TrendingUp,
    title: "Increased efficiency",
    description: "Porttitor ante feugiat vitae quam consectetur nunc."
  }
]

export default function Features() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Why Choose AA?
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover the power of intelligent assistance designed for architects and designers.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 group-hover:bg-yellow-100 transition-all duration-300"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-10 h-10 text-gray-600 group-hover:text-yellow-600 transition-colors duration-300" />
              </motion.div>
              
              <motion.h3 
                className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {feature.title}
              </motion.h3>
              
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 25px -3px rgba(0, 0, 0, 0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}