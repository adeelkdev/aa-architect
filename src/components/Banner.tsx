import { motion } from "framer-motion";
import SearchBar from './SearchBar'

interface BannerProps {
  isSearchActive: boolean
  setIsSearchActive: (active: boolean) => void
}

export default function Banner({ isSearchActive, setIsSearchActive }: BannerProps) {
  return (
    <section className="relative w-full">
      {/* Banner Image Container with correct aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: '1920/764' }}>
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src="https://res.cloudinary.com/de68tfmnt/image/upload/v1754919067/Frame_85_zcuxtc.jpg"
            alt="AA Architect Assistance - Banner"
            className="w-full h-full object-cover object-center"
          />
          
          {/* Subtle floating animation overlay */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-transparent via-transparent to-transparent" />
          </motion.div>
        </motion.div>
        
        {/* Search Bar positioned in the grey bottom area */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-8 sm:pb-12 lg:pb-16 z-50">
          <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <SearchBar 
              isSearchActive={isSearchActive} 
              setIsSearchActive={setIsSearchActive} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}