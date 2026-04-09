// src/pages/home.js
import React, { useState, useEffect } from "react";
import { FaChartLine, FaRobot, FaDatabase, FaFileDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaNewspaper, FaHandsHelping, FaGavel } from "react-icons/fa";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Every Voice Matters",
    description: "Tweets, debates, headlines… every voice tells a story. Who’s listening?",
    image: "/images/voice_of_people.png",
  },
  {
    title: "Lost in the Noise",
    description: "Policies affect us all, but the information is scattered and messy.",
    image: "/images/noiseandcomplexity.png",
  },
  {
    title: "See What Matters",
    description: "Researchers, journalists, and citizens need a clear view of the facts.",
    image: "/images/theneedforclarity.png",
  },
  {
    title: "Technology That Understands",
    description: "Policy Impact Analyzer turns debates, news, and social chatter into clear insights.",
    image: "/images/thesolution.png",
  },
  {
    title: "Connecting People & Policy",
    description: "Bringing governments, media, and citizens together with transparent insights.",
    image: "/images/thevision.png",
  },
];

function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0); // Move here, top-level
  const handleGetStarted = () => {
    navigate("/login");
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gray-50">

     {/* Animated Header */}
<motion.header
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="relative flex justify-between items-center p-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 shadow-2xl sticky top-0 z-50 overflow-hidden"
>
  {/* Sparkles */}
  <div className="absolute inset-0">
    <div className="sparkle" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
    <div className="sparkle" style={{ top: '50%', left: '40%', animationDelay: '2s' }}></div>
    <div className="sparkle" style={{ top: '70%', left: '70%', animationDelay: '4s' }}></div>
    <div className="sparkle" style={{ top: '30%', left: '80%', animationDelay: '1s' }}></div>
    <div className="sparkle" style={{ top: '60%', left: '20%', animationDelay: '3s' }}></div>
  </div>

  {/* Animated Logo */}
  <motion.h1
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, delay: 0.3 }}
    className="text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-300 drop-shadow-xl relative z-10"
  >
    Policy Impact Analyzer
  </motion.h1>

  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, delay: 0.5 }}
    className="flex space-x-4 z-10"
  >
    {/* Login Button */}
    <Link to="/login">
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 py-2 rounded-full font-semibold overflow-hidden group shadow-lg"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x"></span>
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></span>
      <span className="relative text-white">Login</span>
    </motion.button></Link>

    {/* Signup Button */}
    <Link to="/signup">
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 py-2 rounded-full font-semibold overflow-hidden group shadow-lg"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x"></span>
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></span>
      <span className="relative text-white">Signup</span>
    </motion.button></Link>
  </motion.div>
</motion.header>


      {/* Everything below untouched */}
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center px-6 md:px-16 py-28 pt-8 pb-12 overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="flex flex-col md:flex-row w-full items-center gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Left Text */}
            <div className="md:w-1/2 relative z-10 flex flex-col justify-center h-96">
              <h2 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-snug mb-6 drop-shadow-xl">
                {slides[current].title.split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-2 hover:text-purple-600 transition-colors">
                    {word}{" "}
                  </span>
                ))}
              </h2>
              <p className="text-gray-700 text-lg md:text-xl mb-8 drop-shadow-sm">
                {slides[current].description}
              </p>
           <button
                onClick={handleGetStarted}
                className="relative px-10 py-4 rounded-3xl font-bold shadow-2xl overflow-hidden group bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white transform hover:scale-105 transition duration-500">
                Get Started
              </button>
              {/* Slide Dots */}
              <div className="flex space-x-3 mt-10">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-500 transform ${
                      current === index
                        ? "bg-blue-700 scale-125 shadow-lg"
                        : "bg-gray-300 hover:scale-110"
                    }`}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 relative h-96 flex justify-center items-center">
              <div className="absolute w-full h-full rounded-xl shadow-2xl overflow-hidden border-4 border-white/30 backdrop-blur-md">
                <img
                  src={slides[current].image}
                  alt="Hero Illustration"
                  className="w-full h-full object-cover rounded-xl transform hover:scale-105 transition duration-500"
                />
              </div>

              {/* Floating decorative shapes */}
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-purple-300/30 rounded-full animate-pulse-slow blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-36 h-36 bg-pink-300/30 rounded-full animate-pulse-slow blur-3xl"></div>
              <div className="absolute top-20 right-10 w-16 h-16 bg-blue-300/30 rounded-full animate-pulse-slow blur-2xl"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </section>

{/* Features Section */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  viewport={{ once: true }}
  className="px-6 md:px-16 py-24 pt-7 pb-12 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative overflow-hidden"
>
  {/* Floating Decorative Shapes */}
  <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="absolute -bottom-20 -right-10 w-36 h-36 bg-pink-200/20 rounded-full blur-3xl animate-pulse-slow"></div>

  <h3 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 tracking-wide drop-shadow-lg">
    Features
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
    <FeatureCard
      icon={<FaRobot className="w-16 h-16 text-white" />}
      title="Data Insights"
      description="Summarize debates, news & tweets from multiple sources. Turn raw data into actionable insights effortlessly."
    />
    <FeatureCard
      icon={<FaChartLine className="w-16 h-16 text-white" />}
      title="Trend Visualization"
      description="Interactive charts for policy discourse and media trends. Spot patterns at a glance with stunning visuals."
    />
    <FeatureCard
      icon={<FaDatabase className="w-16 h-16 text-white" />}
      title="Multi-Source Integration"
      description="Combine parliamentary, news, and social media sources in one seamless platform."
    />
    <FeatureCard
      icon={<FaFileDownload className="w-16 h-16 text-white" />}
      title="Downloadable Reports"
      description="Export CSV/PDF reports with insightful summaries for research, journalism, or policy evaluation."
    />
  </div>
</motion.section>

{/* Enhanced Use Cases / Target Users Section */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  viewport={{ once: true }}
  className="px-6 md:px-16 py-24 pt-7 pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 relative overflow-hidden"
>
  {/* Floating Decorative Shapes */}
  <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="absolute -bottom-20 -right-10 w-36 h-36 bg-pink-200/20 rounded-full blur-3xl animate-pulse-slow"></div>

  <h3 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 tracking-wide drop-shadow-lg">
    Voices We Serve
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
    {[
      { icon: FaSearch, title: "Researchers", desc: "Track public perception of policies" },
      { icon: FaNewspaper, title: "Journalists", desc: "Generate articles & reports" },
      { icon: FaHandsHelping, title: "NGOs", desc: "Support civic projects" },
      { icon: FaGavel, title: "Policymakers", desc: "Evaluate policy impact" },
    ].map((user, idx) => {
      const Icon = user.icon;
      return (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.08, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-purple-400/50 transform hover:-translate-y-3 transition-all duration-500 group overflow-hidden"
        >
          {/* Floating glows */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-300/30 rounded-full blur-3xl animate-pulse-slow"></div>

          {/* Icon with gradient glow */}
          <div className="mb-4 relative z-10 flex justify-center">
            <div className="p-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse-fast">
              <Icon className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h4 className="text-2xl font-bold text-purple-800 mb-3 relative z-10 drop-shadow-md group-hover:text-pink-600 transition-colors duration-500 text-center">
            {user.title}
          </h4>

          {/* Description */}
          <p className="text-gray-700 relative z-10 text-center">{user.desc}</p>

          {/* Animated glow overlay */}
          <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
        </motion.div>
      );
    })}
  </div>
</motion.section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white px-6 md:px-16 py-20 overflow-hidden">
        {/* Floating glow orbs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-ping -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 z-10">
          
          {/* Branding / Logo */}
          <div>
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-fuchsia-400 to-purple-300 drop-shadow-lg">
              Policy Impact Analyzer
            </h2>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed">
              Empowering transparency, one policy at a time. <br />
              Transforming debates, news, and voices into actionable insights 
              for researchers, journalists, NGOs, and policymakers.
            </p>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
              About Us
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Policy Impact Analyzer is an AI-powered platform that leverages NLP to 
    analyze and summarize parliamentary debates, news, and social media. <br />
    By bridging the gap between discussions and public perception, it empowers 
    transparency, informed research, civic engagement, and data-driven policymaking.
            </p>
          </div>

          {/* Contact & Links */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
              Contact
            </h2>
 <ul className="space-y-3 text-sm text-gray-300">
  <li className="flex items-center space-x-3">
    <FaMapMarkerAlt className="text-pink-400 text-lg" />
    <span>Geethanjali College of Engineering & Technology</span>
  </li>
  <li className="flex items-center space-x-3">
    <FaEnvelope className="text-blue-400 text-lg" />
    <span>support@policyimpact.ai</span>
  </li>
  <li className="flex items-center space-x-3">
    <FaPhoneAlt className="text-purple-400 text-lg" />
    <span>+91 93456 67890</span>
  </li>
  <li className="flex items-center space-x-3">
    <FaGlobe className="text-indigo-400 text-lg" />
    <span>Hyderabad, Telangana, India</span>
  </li>
</ul>
          </div>
        </div>

        {/* Divider with glow */}
        <div className="mt-16 border-t border-white/20 pt-6 text-center text-sm text-gray-400 relative">
          <span className="absolute left-1/2 -top-2 w-24 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full -translate-x-1/2"></span>
          © 2025 Policy Impact Analyzer. All rights reserved. <br />
        </div>
      </footer>



    </div>
  );
}

// Feature Card
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    // whileHover={{ scale: 1.08, rotate: 1 }}
    whileHover={{ scale: 1.08}}
    whileTap={{ scale: 0.95 }}
    // initial={{ opacity: 0, y: 30 }}
    // whileInView={{ opacity: 1, y: 0 }}
    // transition={{ duration: 0.8 }}
    className="relative bg-white p-8 rounded-3xl shadow-2xl hover:shadow-purple-400/50 transform hover:-translate-y-3 transition-all duration-500 group overflow-hidden"
  >
    {/* Floating glows */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-300/30 rounded-full blur-3xl animate-pulse-slow"></div>

    {/* Icon with gradient glow */}
    <div className="mb-4 relative z-10 flex justify-center">
      <div className="p-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse-fast">
        {icon}
      </div>
    </div>

    {/* Title */}
    <h4 className="text-2xl font-bold text-purple-800 mb-3 relative z-10 drop-shadow-md group-hover:text-pink-600 transition-colors duration-500 text-center">
      {title}
    </h4>

    {/* Description */}
    <p className="text-gray-700 relative z-10 text-center">{description}</p>

    {/* Animated glow overlay */}
    <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
  </motion.div>
);


// User Card
const UserCard = ({ title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-blue-400/50 transform hover:-translate-y-2 transition duration-500">
    <h4 className="text-xl font-semibold mb-2 text-blue-700">{title}</h4>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default Home;
