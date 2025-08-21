import { motion } from "framer-motion";
import { Truck } from 'lucide-react'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: '1920/672' }}>
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img
              src="https://res.cloudinary.com/de68tfmnt/image/upload/v1754922462/Frame_86_xj8dya.jpg"
              alt="About AA - Colorful background with professional woman"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Content Overlay */}
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Text content */}
                <motion.div
                  className="space-y-6 lg:space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.h1
                    className="text-black text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    About us
                  </motion.h1>
                  
                  <motion.p
                    className="text-black text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    Since 1905, we have been committed to putting UK drivers first. We're a source of expertise and support for our members, and have evolved into a pioneering, multi-service provider for the modern, ever-changing driving world.
                  </motion.p>
                </motion.div>

                {/* Right side - Image space (already part of background) */}
                <div className="hidden lg:block">
                  {/* This space is for the woman image which is part of the background */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Working Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center gap-4 lg:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Icon */}
            <motion.div
              className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-yellow-400 rounded-full flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ duration: 0.3 }}
            >
              <Truck className="w-8 h-8 lg:w-10 lg:h-10 text-black" />
            </motion.div>

            {/* Text */}
            <motion.h2
              className="text-black text-2xl lg:text-3xl xl:text-4xl font-bold"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Field Working
            </motion.h2>
          </motion.div>

          {/* Additional content for Field Working */}
          <motion.div
            className="mt-8 lg:mt-12 ml-20 lg:ml-26"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-3xl">
              Our field teams work across the UK to provide on-site assistance, emergency breakdown recovery, and professional automotive services. We're always ready to help when you need us most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Additional sections can be added here */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Our Commitment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-12">
              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-black">1905</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Heritage</h3>
                <p className="text-gray-600">
                  Over a century of trusted service and automotive expertise.
                </p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-black">24/7</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Support</h3>
                <p className="text-gray-600">
                  Round-the-clock assistance whenever you need us.
                </p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-black">UK</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Coverage</h3>
                <p className="text-gray-600">
                  Comprehensive coverage across the entire United Kingdom.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}