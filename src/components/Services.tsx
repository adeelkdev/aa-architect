import { motion } from "framer-motion";
import { Car, Shield, GraduationCap, MapPin, Wrench, Phone, Clock, Users } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Car,
      title: "Breakdown Cover",
      description: "24/7 roadside assistance across the UK. From flat tyres to engine troubles, we'll get you moving again.",
      features: ["Roadside assistance", "Recovery service", "Home start", "Relay service"]
    },
    {
      icon: Shield,
      title: "Insurance Services",
      description: "Comprehensive car, home, and travel insurance with competitive rates and excellent coverage.",
      features: ["Car insurance", "Home insurance", "Travel insurance", "Breakdown cover included"]
    },
    {
      icon: GraduationCap,
      title: "Driving School",
      description: "Learn to drive with the UK's most trusted driving school. Expert instructors and high pass rates.",
      features: ["Qualified instructors", "Theory test support", "Intensive courses", "Pass Plus scheme"]
    },
    {
      icon: MapPin,
      title: "Route Planning",
      description: "Plan your journey with our advanced route planning tools and real-time traffic updates.",
      features: ["Live traffic updates", "Route optimization", "Fuel cost calculator", "Points of interest"]
    },
    {
      icon: Wrench,
      title: "Vehicle Services",
      description: "MOT testing, servicing, and repairs at AA approved garages nationwide.",
      features: ["MOT testing", "Annual servicing", "Diagnostic checks", "Tyre fitting"]
    },
    {
      icon: Users,
      title: "Member Benefits",
      description: "Exclusive discounts and offers for AA members across dining, shopping, and entertainment.",
      features: ["Restaurant discounts", "Shopping offers", "Holiday deals", "Entertainment savings"]
    }
  ]

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
              src="https://res.cloudinary.com/de68tfmnt/image/upload/v1754922798/Frame_87_gvcudy.png"
              alt="AA Services - What we do"
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
                    className="text-white text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    What we do
                  </motion.h1>
                  
                  <motion.p
                    className="text-white text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    From breakdown assistance to driving lessons, insurance to route planning - we're here to keep Britain moving with confidence and peace of mind.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive automotive services designed to keep you safe, mobile, and confident on the road.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <service.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-4 lg:gap-6">
              <motion.div
                className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-red-500 rounded-full flex items-center justify-center"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 5,
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Phone className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </motion.div>

              <div className="text-left">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
                  Emergency Breakdown
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                  Call 0800 88 77 66 - Available 24/7, 365 days a year
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Average Response</h3>
                <p className="text-gray-600">
                  30 minutes average response time for emergency callouts
                </p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">UK Coverage</h3>
                <p className="text-gray-600">
                  Complete coverage across England, Scotland, Wales & N. Ireland
                </p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Expert Technicians</h3>
                <p className="text-gray-600">
                  Over 3,000 qualified technicians ready to help
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}