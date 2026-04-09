import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaChartLine,
  FaLightbulb,
  FaGavel,
  FaArrowLeft,
  FaExpand,
  FaCompress,
  FaCheck,
  FaClipboardList,
  FaCalendarAlt,
  FaStar,
  FaBullseye,
  FaCog,
  FaComments,
  FaExclamationTriangle,
  FaRocket,
  FaFileAlt,
} from "react-icons/fa";

// Debounce hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(value), delay);
  }, [callback, delay]);
};

const PolicySearch = () => {
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Prevent double-open from rapid repeated clicks
  const openingRef = useRef(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/policies?q=${searchQuery}`
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch policy data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebounce(performSearch, 400);

  const handleSearch = useCallback(
    (e) => {
      if (e) e.preventDefault();
      performSearch(query);
    },
    [query, performSearch]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handlePolicyClick = useCallback((policy) => {
    if (openingRef.current) return;
    openingRef.current = true;
    setSelectedPolicy(policy);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPolicy(null);
    openingRef.current = false;
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard", { state: { skipIntro: true } })}
          className="mb-8 flex items-center gap-2 text-white font-semibold hover:text-purple-300 transition-colors"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl md:text-5xl text-yellow-400 filter drop-shadow-md select-none mr-3"
            >
              🏛️
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md leading-tight pb-2 whitespace-nowrap">
              Policy Intelligence
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto -mt-5">
             Unlock insights from <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">comprehensive </span>Indian government policies
          </p>
        </motion.div>

        {/* Search Box with Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-25"></div>
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-purple-400/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl group hover:border-purple-300/80 hover:shadow-purple-500/30 transition-all">
            <div className="flex gap-3 mb-6 items-center">
              <FaSearch className="text-purple-400 text-3xl" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Explore Policies
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                value={query}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="education, agriculture, health, women empowerment, energy..."
                className="flex-1 bg-gray-800/60 border-2 border-purple-500/40 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-500/60 transition-all text-lg font-medium"
              />
              <motion.button
                onClick={handleSearch}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                <FaSearch /> Search
              </motion.button>
            </div>
            <p className="text-gray-400 text-sm mt-5 font-medium">💡 Try: women, education, health, agriculture, employment, energy...</p>
          </div>
        </motion.div>

        {/* Loading Animation */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg font-semibold">Searching 101 policies...</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-6 mb-8 text-red-300 font-semibold backdrop-blur-xl"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="text-4xl"
                >
                  <FaChartLine className="text-4xl text-cyan-400 animate-pulse" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Results Found: {results.length}
                </h2>
              </div>
              <div className="h-2 w-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"></div>
            </motion.div>
          )}

          {results.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handlePolicyClick(item)}
              className="group relative cursor-pointer"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 group-hover:border-purple-400/50 rounded-2xl p-6 md:p-8 backdrop-blur-xl transition-all duration-300 shadow-lg">
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-500 mb-2 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap shadow-lg transition-all flex items-center gap-2">
                    <FaCheck className="text-sm" /> {item.status || "Active"}
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <FaClipboardList className="text-purple-400 text-lg flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ministry</p>
                      <p className="text-white font-semibold text-sm">{item.ministry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaGavel className="text-pink-400 text-lg flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Category</p>
                      <p className="text-white font-semibold text-sm">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-cyan-400 text-lg flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Issued</p>
                      <p className="text-white font-semibold text-sm">{formatDate(item.issueDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-gray-300 leading-relaxed mb-8 line-clamp-3 text-base font-light">
                  {item.summary || item.content.slice(0, 300)}...
                </p>

                {/* Call to Action */}
                <button className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text font-bold text-sm flex items-center gap-2">
                  View Full Details →
                </button>
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {results.length === 0 && !loading && query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaLightbulb className="text-6xl text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-2xl text-gray-400 font-semibold mb-2">No results found</p>
              <p className="text-gray-500">Try searching with different keywords like "education", "health", or "women"</p>
            </motion.div>
          )}

          {/* Initial State */}
          {results.length === 0 && !loading && !query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 space-y-6"
            >
              <FaGavel className="text-7xl text-purple-400 mx-auto opacity-40" />
              <div>
                <p className="text-2xl text-gray-300 font-semibold mb-2">Ready to explore?</p>
                <p className="text-gray-500">Search across our comprehensive database of <span className="text-cyan-400 font-bold">Indian government policies</span></p>
              </div>
            </motion.div>
          )}
        </div>

      </div>

      {/* Modal Popup */}
      {showModal && selectedPolicy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
         <motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  onClick={(e) => e.stopPropagation()}
  className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl w-full overflow-y-auto border border-purple-500/50 relative transition-all duration-500
    ${isFullscreen 
      ? "h-screen max-w-none rounded-none"
      : "max-w-5xl max-h-[90vh] rounded-3xl"
    }
  `}
>

            
            {/* Modal Header - Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 text-white p-6 md:p-8 flex justify-between items-start gap-4 shadow-xl z-10 rounded-t-3xl">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">{selectedPolicy.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold border border-white/30"
                  >
                    ✓ {selectedPolicy.status || "Active"}
                  </motion.span>
                  <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                    📅 {formatDate(selectedPolicy.issueDate)}
                  </span>
                </div>
              </div>
            <div className="flex items-center gap-4">


  {/* Close Button */}
<button
  onClick={closeModal}
  className="text-3xl hover:text-purple-200 transition text-white font-bold w-10 h-10 flex items-center justify-center"
>
  ✕
</button>

<button
  onClick={toggleFullscreen}
  title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
  className="text-2xl hover:text-purple-200 transition text-white"
>
  {isFullscreen ? <FaCompress /> : <FaExpand />}
</button>

</div>

            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 space-y-8">
            {/* Key Information Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
              >
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">📋 Ministry</p>
                  <p className="text-white font-bold text-lg">{selectedPolicy.ministry}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">🏷️ Category</p>
                  <p className="text-white font-bold text-lg">{selectedPolicy.category}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">💰 Budget</p>
                  <p className="text-white font-bold text-lg">{selectedPolicy.budget || "N/A"}</p>
                </div>
              </motion.div>

              {/* Summary Section */}
              {/* {selectedPolicy.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-3 flex items-center gap-2">
                    <FaFileAlt /> Summary
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-lg">{selectedPolicy.summary}</p>
                </motion.div>
              )} */}

              {/* Objectives */}
              {selectedPolicy.objectives && selectedPolicy.objectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <FaBullseye /> Objectives
                  </h3>
                  <ul className="space-y-2">
                    {selectedPolicy.objectives.map((obj, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-200">
                        <FaCheck className="text-blue-400 flex-shrink-0 mt-1" />
                        <span className="text-base">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Benefits */}
              {selectedPolicy.benefits && selectedPolicy.benefits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                    <FaStar /> Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedPolicy.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-200">
                        <FaStar className="text-green-400 flex-shrink-0 mt-1 text-sm" />
                        <span className="text-base">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Key Highlights */}
              {selectedPolicy.keyHighlights && selectedPolicy.keyHighlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                    <FaChartLine /> Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {selectedPolicy.keyHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-200">
                        <span className="text-yellow-400 font-bold flex-shrink-0 mt-1">◆</span>
                        <span className="text-base">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Target Audience */}
              {selectedPolicy.targetAudience && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-l-4 border-pink-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-pink-300 mb-3 flex items-center gap-2">
                    <FaGavel /> Target Audience
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed">{selectedPolicy.targetAudience}</p>
                </motion.div>
              )}

              {/* Implementation */}
              {selectedPolicy.implementation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-l-4 border-purple-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <FaCog /> Implementation
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed">{selectedPolicy.implementation}</p>
                </motion.div>
              )}

              {/* Parliament Discussions */}
              {selectedPolicy.parliamentDiscussions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-l-4 border-orange-500 rounded-lg p-6 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold text-orange-300 mb-3 flex items-center gap-2">
                    <FaGavel /> Parliament Discussions
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed">{selectedPolicy.parliamentDiscussions}</p>
                </motion.div>
              )}

              {/* Debates */}
              {selectedPolicy.debates && selectedPolicy.debates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-l-4 border-red-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                    <FaComments /> Key Debates & Discussions
                  </h3>
                  <ul className="space-y-3">
                    {selectedPolicy.debates.map((debate, idx) => {
                      const [title, desc] = debate.split(" - ");
                      return (
                        <li key={idx}>
                          <h4 className="font-bold text-red-400 mb-1 text-base">{title || debate}</h4>
                          {desc && <p className="text-gray-300 text-sm">{desc}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}

              {/* Amendments */}
              {selectedPolicy.amendments && selectedPolicy.amendments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-l-4 border-indigo-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
                    <FaClipboardList /> Amendments Made
                  </h3>
                  <ul className="space-y-2">
                    {selectedPolicy.amendments.map((amendment, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-200">
                        <span className="text-indigo-400 font-bold text-sm flex-shrink-0 bg-indigo-500/20 rounded-full w-6 h-6 flex items-center justify-center">{idx + 1}</span>
                        <span className="text-base">{amendment}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Challenges */}
              {selectedPolicy.challenges && selectedPolicy.challenges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-l-4 border-amber-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                    <FaExclamationTriangle /> Implementation Challenges
                  </h3>
                  <ul className="space-y-2">
                    {selectedPolicy.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-200">
                        <span className="text-amber-400 font-bold flex-shrink-0 mt-1">●</span>
                        <span className="text-base">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Future Prospects */}
              {selectedPolicy.futureProspects && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border-l-4 border-green-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                    <FaRocket /> Future Prospects & Vision
                  </h3>
                  <p className="text-gray-200 text-base leading-relaxed">{selectedPolicy.futureProspects}</p>
                </motion.div>
              )}

              {/* Official Sources Documentation */}
              {selectedPolicy.sourceDocumentation?.sources && selectedPolicy.sourceDocumentation.sources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-emerald-500 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                    🔍 Official Sources Documentation
                  </h3>
                  <div className="space-y-4">
                    {selectedPolicy.sourceDocumentation.sources.map((source, idx) => (
                      <div key={idx} className="bg-gray-900/40 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors">
                        <div className="flex items-start justify-between mb-3 gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-emerald-300 text-base mb-1 flex items-center gap-2">
                              <span className="bg-emerald-500/30 rounded-full w-6 h-6 flex items-center justify-center text-xs text-emerald-300 font-bold">{idx + 1}</span>
                              {source.sourceName}
                            </h4>
                            <p className="text-gray-400 text-sm">{source.sourceType}</p>
                          </div>
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-4 py-2 rounded-lg text-lg text-center whitespace-nowrap">
                            {source.percentageOfData || 0}%
                          </div>
                        </div>
                        {source.sourceURL && (
                          <div className="mb-3">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Official URL</p>
                            <a href={source.sourceURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm break-all underline flex items-center gap-1">
                              🔗 {source.sourceURL}
                            </a>
                          </div>
                        )}
                        {source.dataParts && source.dataParts.length > 0 && (
                          <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Data Covered</p>
                            <div className="flex flex-wrap gap-2">
                              {source.dataParts.map((part, i) => (
                                <span key={i} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                                  • {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Full Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaFileAlt /> Detailed Content
                </h3>
                <p className="text-gray-300 leading-relaxed text-base">{selectedPolicy.content}</p>
              </motion.div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-purple-500/30 p-6 md:p-8 flex justify-end rounded-b-3xl">
              <motion.button
                onClick={closeModal}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};

export default PolicySearch;
