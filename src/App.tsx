import { useState } from "react";
import Header from "@/components/Header"
import Banner from "@/components/Banner"
import Features from "@/components/Features"
import AboutUs from "@/components/AboutUs"
import Services from "@/components/Services"
import Contact from "@/components/Contact"

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'services' | 'contact'>('home')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs />
      case 'services':
        return <Services />
      case 'contact':
        return <Contact />
      case 'home':
      default:
        return (
          <>
            <Banner isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
            <Features />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Blur overlay when search is active */}
      {isSearchActive && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsSearchActive(false)}
        />
      )}
      
      <div className={`transition-all duration-300 ${isSearchActive ? 'blur-sm' : ''}`}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      
      <div className={`transition-all duration-300 ${isSearchActive && currentPage === 'home' ? '' : isSearchActive ? 'blur-sm' : ''}`}>
        {renderPage()}
      </div>
    </div>
  )
}