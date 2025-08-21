import { useState } from 'react'
import { motion } from "framer-motion";
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  currentPage: 'home' | 'about' | 'services' | 'contact'
  setCurrentPage: (page: 'home' | 'about' | 'services' | 'contact') => void
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (page: 'home' | 'about' | 'services' | 'contact') => {
    setCurrentPage(page)
    setIsMenuOpen(false) // Close mobile menu when navigating
  }

  const isActive = (page: string) => currentPage === page

  return (
    <motion.header 
      className="bg-yellow-400 px-4 sm:px-6 py-4 relative z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.button 
          className="flex items-center"
          onClick={() => handleNavClick('home')}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/de68tfmnt/image/upload/v1754919672/AA_pemq7f.png"
            alt="AA Logo"
            className="h-8 sm:h-10 w-auto"
          />
        </motion.button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8">
          <motion.button 
            onClick={() => handleNavClick('about')}
            className={`transition-colors duration-200 font-medium text-sm lg:text-base ${
              isActive('about') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Who we are
          </motion.button>
          <motion.button 
            onClick={() => handleNavClick('services')}
            className={`transition-colors duration-200 font-medium text-sm lg:text-base ${
              isActive('services') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            What we do
          </motion.button>
          <motion.button 
            onClick={() => handleNavClick('contact')}
            className={`transition-colors duration-200 font-medium text-sm lg:text-base ${
              isActive('contact') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            How to contact
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 text-black hover:text-gray-700 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden absolute top-full left-0 right-0 bg-yellow-400 border-t border-yellow-500"
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0, 
          height: isMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <nav className="px-4 py-4 space-y-4">
          <motion.button 
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left transition-colors duration-200 font-medium ${
              isActive('about') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ x: 10 }}
            transition={{ duration: 0.2 }}
          >
            Who we are
          </motion.button>
          <motion.button 
            onClick={() => handleNavClick('services')}
            className={`block w-full text-left transition-colors duration-200 font-medium ${
              isActive('services') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ x: 10 }}
            transition={{ duration: 0.2 }}
          >
            What we do
          </motion.button>
          <motion.button 
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left transition-colors duration-200 font-medium ${
              isActive('contact') 
                ? 'text-gray-900 font-semibold' 
                : 'text-black hover:text-gray-700'
            }`}
            whileHover={{ x: 10 }}
            transition={{ duration: 0.2 }}
          >
            How to contact
          </motion.button>
        </nav>
      </motion.div>
    </motion.header>
  )
}