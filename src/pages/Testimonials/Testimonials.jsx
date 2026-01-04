import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    role: "Project Manager",
    company: "Tech Startup Indonesia",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    quote: "Dimas adalah developer yang sangat dedicated dan selalu memberikan hasil terbaik. Kemampuannya dalam AI dan web development sangat impressive.",
    quoteEn: "Dimas is a highly dedicated developer who always delivers the best results. His skills in AI and web development are impressive."
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    role: "UI/UX Designer",
    company: "Creative Agency",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    quote: "Bekerja dengan Dimas sangat menyenangkan. Dia sangat memahami pentingnya design yang baik dan selalu mengimplementasikannya dengan sempurna.",
    quoteEn: "Working with Dimas is very enjoyable. He truly understands the importance of good design and always implements it perfectly."
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Senior Developer",
    company: "Software House",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    quote: "Kemampuan problem-solving Dimas sangat luar biasa. Dia selalu bisa menemukan solusi kreatif untuk masalah yang kompleks.",
    quoteEn: "Dimas's problem-solving ability is outstanding. He can always find creative solutions to complex problems."
  },
  {
    id: 4,
    name: "Lisa Chen",
    role: "Tech Lead",
    company: "International Corp",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    quote: "I've worked with many developers, and Dimas stands out for his attention to detail and commitment to quality code.",
    quoteEn: "I've worked with many developers, and Dimas stands out for his attention to detail and commitment to quality code."
  }
];

const TestimonialCard = ({ testimonial, index, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 overflow-hidden group"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
        <Quote size={48} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Avatar and Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30">
            <img 
              src={testimonial.image} 
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">{testimonial.name}</h3>
            <p className="text-sm text-gray-400">{testimonial.role}</p>
            <p className="text-xs text-blue-400">{testimonial.company}</p>
          </div>
        </div>
        
        {/* Quote */}
        <p className="text-gray-300 leading-relaxed italic">
          "{language === 'id' ? testimonial.quote : testimonial.quoteEn}"
        </p>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  
  return (
    <main className="pt-20 lg:pt-0 bg-[#04081A] text-white min-h-screen relative overflow-hidden">
      <GridBackground />
      <section className="min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                index={index}
                language={i18n.language}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
