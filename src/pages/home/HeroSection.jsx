import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "🚀 Welcome to HackathonX!",
    subtitle:
      "Join the revolution. Build, innovate, and collaborate with the best minds!",
    cta: "Register Now",
    bgImage: "/posterBackground/welcome.jpg", // Replace with your image path
  },
  {
    title: "🔥 Trending Features",
    subtitle:
      "AI-powered coding assistance, live debugging, and real-time collaboration!",
    cta: "Explore Features",
    bgImage: "/posterBackground/trendingFeatures.jpg",
  },
  {
    title: "📢 Announcements",
    subtitle: "New prize categories added! Check out the latest updates.",
    cta: "View Details",
    bgImage: "/posterBackground/announcements.jpg",
  },
  {
    title: "👤 Complete Your Profile!",
    subtitle: "Get better team recommendations & exclusive perks!",
    cta: "Update Profile",
    bgImage: "/posterBackground/completeProfile.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [current]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full mx-auto h-[500px] flex items-center justify-center overflow-hidden px-4">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `url(${slides[current].bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute w-full h-full flex flex-col items-center justify-center text-center p-10 text-white rounded-2xl shadow-lg"
        >
          <h1 className="text-4xl font-bold">{slides[current].title}</h1>
          <p className="text-lg mt-2">{slides[current].subtitle}</p>
          <Button className="mt-4 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80">
            {slides[current].cta}
          </Button>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-5 bg-black text-white p-2 rounded-full z-10 hover:bg-gray-800"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-5 bg-black text-white p-2 rounded-full z-10 hover:bg-gray-800"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-5 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => {
              if (index !== current) {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
