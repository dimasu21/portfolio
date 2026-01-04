import React, { useState, useEffect } from "react";
import "./assets/css/index.css";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contact/Contact";
import Projects from "./pages/Projects/Projects";
import Header from "./pages/Header/Header";
import Hero from "./pages/Hero/Hero";
import Skills from "./pages/Skills/Skills";
import Certificate from "./pages/Certificate/Certificate";
import Service from "./pages/Service/Service";
import Guestbook from "./pages/Guestbook/Guestbook";
import Blog from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import BlogAdmin from "./pages/BlogAdmin/BlogAdmin";
import PrivacyPage from "./pages/Legal/PrivacyPage";
import Disclaimer from "./pages/Legal/Disclaimer";
import Footer from "./components/Footer";
import CursorTrail from "./components/CursorTrail";
import ScrollToTop from "./components/ScrollToTop";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [isOnePage, setIsOnePage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent flickering by waiting for initial render to complete
  useEffect(() => {
    // Small delay to ensure scroll position is set before showing content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ScrollToTop />
      <div 
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
      {/* <CursorTrail /> */}
      <Header />
      {isOnePage ? (
        <>
          <Hero />
          <Skills />
          <Experience />
          <Certificate />
          <Contact />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/service" element={<Service />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      )}
      <Footer />
      </div>
    </AuthProvider>
  );
}
