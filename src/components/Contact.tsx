import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Twitter, Instagram, Headphones, GraduationCap } from 'lucide-react'

export default function Contact() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Emergency Breakdown",
      description: "24/7 emergency roadside assistance",
      contact: "0800 88 77 66",
      availability: "Available 24/7, 365 days a year",
      bgColor: "bg-red-500"
    },
    {
      icon: Headphones,
      title: "Customer Services",
      description: "General enquiries and account support",
      contact: "0800 085 2721",
      availability: "Mon-Fri 8am-8pm, Sat-Sun 9am-5pm",
      bgColor: "bg-blue-500"
    },
    {
      icon: Phone,
      title: "Insurance Claims",
      description: "Report and manage insurance claims",
      contact: "0800 269 622",
      availability: "Mon-Fri 8am-8pm, Sat 9am-5pm",
      bgColor: "bg-green-500"
    },
    {
      icon: GraduationCap,
      title: "Driving School",
      description: "Book lessons and instructor enquiries",
      contact: "0800 587 0087",
      availability: "Mon-Fri 8am-6pm, Sat 9am-4pm",
      bgColor: "bg-purple-500"
    }
  ]

  const digitalContacts = [
    {
      icon: Mail,
      title: "Email Support",
      description: "customer.services@theaa.com",
      note: "Response within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available on our website",
      note: "Mon-Fri 8am-8pm"
    },
    {
      icon: Facebook,
      title: "Facebook",
      description: "@TheAAUK",
      note: "Social media support"
    },
    {
      icon: Twitter,
      title: "Twitter",
      description: "@TheAA_UK",
      note: "Quick updates and support"
    }
  ]

  const offices = [
    {
      city: "London",
      address: "Fanum House, Basing View, Basingstoke, Hampshire RG21 4EA",
      phone: "01256 492050"
    },
    {
      city: "Birmingham",
      address: "Edmund House, 12-22 Newhall Street, Birmingham B3 3AS",
      phone: "0121 233 2000"
    },
    {
      city: "Manchester",
      address: "Building 3, Cheadle Royal Business Park, Cheadle SK8 3GX",
      phone: "0161 491 7000"
    },
    {
      city: "Edinburgh",
      address: "Thistle House, 4 Rothesay Terrace, Edinburgh EH3 7RY",
      phone: "0131 240 3000"
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
              src="https://res.cloudinary.com/de68tfmnt/image/upload/v1754923167/Frame_88_sieqnp.png"
              alt="Contact AA - How to contact us"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Content Overlay */}
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
                    How to contact
                  </motion.h1>
                  
                  <motion.p
                    className="text-black text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    We're here to help 24/7. Whether it's an emergency breakdown or a general enquiry, choose the best way to reach us.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Contact Methods */}
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
              Call Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Direct phone lines for all your AA needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${method.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">{method.contact}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {method.availability}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Contact Methods */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Digital Channels
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch through email, chat, and social media
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalContacts.map((contact, index) => (
              <motion.div
                key={contact.title}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-700 font-medium mb-2">{contact.description}</p>
                <p className="text-sm text-gray-500">{contact.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
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
              Office Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visit us at one of our regional offices across the UK
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{office.city}</h3>
                    <p className="text-gray-600 mb-3 leading-relaxed">{office.address}</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {office.phone}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}