import React, { useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  FaArrowLeft,
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaGavel,
  FaCheck,
  FaClipboardList,
  FaCalendarAlt,
  FaStar,
  FaBullseye,
  FaCog,
  FaComments,
  FaExclamationTriangle,
  FaRocket,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

// Debounce hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(value), delay);
  }, [callback, delay]);
};

const ReportSharing = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const searchInputRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/policies?q=${searchQuery}`
      );
      setSuggestions(res.data.slice(0, 10)); // Show top 10 suggestions
    } catch (err) {
      console.error(err);
      setError("Failed to fetch policies");
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const debouncedSearch = useDebounce(performSearch, 400);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      if (value.trim()) {
        debouncedSearch(value);
      } else {
        setSuggestions([]);
      }
    },
    [debouncedSearch]
  );

  const handlePolicySelect = useCallback((policy) => {
    setSelectedPolicy(policy);
    setQuery(policy.title);
    setSuggestions([]);
    setPdfGenerated(false);
  }, []);

  const generatePDF = useCallback(() => {
  if (!selectedPolicy) return;

  setGeneratingPdf(true);

  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 16;

    let y = margin;
    let page = 1;

    // Enhanced color palette
    const colors = {
      primary: [30, 64, 175],        // Deep blue
      primaryLight: [59, 130, 246],  // Lighter blue
      accent: [34, 211, 238],        // Cyan
      accentPurple: [168, 85, 247],  // Purple
      success: [34, 197, 94],        // Green
      warning: [245, 158, 11],       // Amber
      danger: [239, 68, 68],         // Red
      text: [55, 65, 81],            // Gray-700
      textLight: [107, 114, 128],    // Gray-500
      textVeryLight: [156, 163, 175],// Gray-400
      background: [249, 250, 251],   // Gray-50
      border: [203, 213, 225],       // Gray-300
      white: [255, 255, 255],
    };

    const addFooter = () => {
      // Footer background line
      pdf.setDrawColor(...colors.border);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - footerHeight + 2, pageWidth - margin, pageHeight - footerHeight + 2);

      pdf.setFontSize(9);
      pdf.setTextColor(...colors.textVeryLight);
      pdf.setFont("Helvetica", "normal");
      pdf.text(
        `${selectedPolicy.title.substring(0, 40)}...`,
        margin,
        pageHeight - 8
      );

      pdf.setFontSize(8);
      pdf.text(
        `Page ${page} | Generated on ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: "right" }
      );
    };

    const checkPage = (space = 12) => {
      if (y + space > pageHeight - footerHeight) {
        addFooter();
        pdf.addPage();
        page++;
        y = margin;
      }
    };

    const sectionHeader = (title, icon = "") => {
      // Ensure there's space for the header and at least one line of content below it
      checkPage(20);
      
      // Gradient-like effect using colored background
      pdf.setFillColor(...colors.primary);
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");

      // Icon and title
      pdf.setFontSize(13);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.white);
      pdf.text(`${icon} ${title}`, margin + 5, y + 6.5);

      // Decorative line under header
      pdf.setDrawColor(...colors.primaryLight);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y + 11, pageWidth - margin, y + 11);

      y += 16;
    };

    const subsectionHeader = (title) => {
      checkPage(10);
      pdf.setFontSize(11);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.primary);
      pdf.text(title, margin + 3, y);

      // Underline
      pdf.setDrawColor(...colors.accentPurple);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 3, y + 1.5, margin + 35, y + 1.5);

      y += 8;
    };

    const justifyText = (line, startX, currentY, maxWidth, size, isBold) => {
      const words = line.split(' ').filter(word => word.length > 0);
      
      if (words.length === 1) {
        // Single word, just print it
        pdf.text(words[0], startX, currentY);
        return;
      }
      
      // Calculate widths
      const charWidth = pdf.getStringUnitWidth(' ') * size / pdf.internal.scaleFactor;
      let totalWidth = 0;
      const wordWidths = words.map(word => {
        const width = pdf.getStringUnitWidth(word) * size / pdf.internal.scaleFactor;
        totalWidth += width;
        return width;
      });
      
      // Calculate space between words
      const totalSpaceWidth = maxWidth - totalWidth;
      const gaps = words.length - 1;
      const spaceBetweenWords = gaps > 0 ? totalSpaceWidth / gaps : 0;
      
      // Draw justified text
      let currentX = startX;
      words.forEach((word, index) => {
        pdf.text(word, currentX, currentY);
        if (index < words.length - 1) {
          currentX += wordWidths[index] + spaceBetweenWords;
        }
      });
    };

    const paragraph = (text, size = 10, isBold = false) => {
      pdf.setFontSize(size);
      pdf.setFont("Helvetica", isBold ? "bold" : "normal");
      pdf.setTextColor(...colors.text);

      const lines = pdf.splitTextToSize(text, contentWidth - 8);
      
      // Calculate proper line height
      const lineHeight = size > 10 ? 8 : (size === 10 ? 6.5 : 6);
      
      lines.forEach((line, index) => {
        // Check with adequate buffer space (add 2mm buffer for safety)
        checkPage(lineHeight + 2);
        
        // Reapply text formatting after page break
        pdf.setFontSize(size);
        pdf.setFont("Helvetica", isBold ? "bold" : "normal");
        pdf.setTextColor(...colors.text);
        
        // Justify text, except for the last line
        const isLastLine = index === lines.length - 1;
        
        if (isLastLine) {
          // Last line: left-aligned
          pdf.text(line, margin + 4, y);
        } else {
          // Other lines: justified
          justifyText(line, margin + 4, y, contentWidth - 8, size, isBold);
        }
        
        y += lineHeight;
      });

      y += 5; // Increased spacing after paragraph for better section separation
    };

    const bulletList = (items) => {
      pdf.setFontSize(10);
      pdf.setFont("Helvetica", "normal");
      pdf.setTextColor(...colors.text);

      items.forEach((item, index) => {
        const lines = pdf.splitTextToSize(item, contentWidth - 16);
        lines.forEach((line, i) => {
          checkPage(7);
          // Reapply text formatting after page break
          pdf.setFontSize(10);
          pdf.setFont("Helvetica", "normal");
          if (i === 0) {
            // Colored bullet points
            pdf.setTextColor(...colors.accent);
            pdf.text("*", margin + 5, y);
            pdf.setTextColor(...colors.text);
          } else {
            pdf.setTextColor(...colors.text);
          }
          pdf.text(line, margin + 12, y);
          y += 6.5;
        });
        y += 1;
      });

      y += 3;
    };

    const infoBox = (label, value) => {
      pdf.setFillColor(...colors.background);
      pdf.roundedRect(margin, y, contentWidth, 14, 1, 1, "F");

      pdf.setFontSize(9);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.textLight);
      pdf.text(label, margin + 4, y + 4.5);

      pdf.setFontSize(10);
      pdf.setFont("Helvetica", "normal");
      pdf.setTextColor(...colors.text);
      pdf.text(value || "N/A", margin + 4, y + 10);

      y += 16;
    };

    /* ---------- TITLE PAGE ---------- */
    
    // Decorative header line
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(2);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 14;  // Increased spacing to give title more room

    // Policy title
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(...colors.primary);

    const titleLines = pdf.splitTextToSize(selectedPolicy.title, contentWidth);
    titleLines.forEach((line, idx) => {
      pdf.text(line, pageWidth / 2, y, { align: "center" });
      y += 12;
    });

    y += 8;

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor(...colors.textLight);
    pdf.text("Government Policy Report", pageWidth / 2, y, { align: "center" });

    y += 4;  // Increased spacing significantly

    // Decorative separator
    pdf.setDrawColor(...colors.accent);
    pdf.setLineWidth(1);
    pdf.line(margin + 40, y, pageWidth - margin - 40, y);
    y += 10;

    /* --- Enhanced Policy Details Section --- */
    const metaData = [
      { label: "Ministry", value: selectedPolicy.ministry },
      { label: "Category", value: selectedPolicy.category },
      { label: "Issued Date", value: new Date(selectedPolicy.issueDate).toLocaleDateString() },
    ];

    pdf.setFontSize(11);
    pdf.setFont("Helvetica", "bold");
    pdf.setTextColor(...colors.primary);
    pdf.text("Policy Information", margin + 4, y);
    y += 8;

    // Draw a border box with improved spacing
    pdf.setDrawColor(...colors.border);
    pdf.setLineWidth(0.5);
    
    // Improved box dimensions - adjust for 3 items instead of 4
    const boxHeight = 48;
    pdf.rect(margin, y, contentWidth, boxHeight);

    // Create a 1x3 grid for metadata (single row, three columns)
    const colWidth = contentWidth / 3;
    const rowHeight = 40;

    metaData.forEach((data, idx) => {
      const row = 0;
      const col = idx;
      const boxX = margin + col * colWidth + 4;
      const boxY = y + row * rowHeight + 4;

      // Don't truncate - use text wrapping instead
      let displayValue = data.value;

      pdf.setFontSize(8);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.primary);
      pdf.text(data.label + ":", boxX, boxY);

      pdf.setFontSize(9);
      pdf.setFont("Helvetica", "normal");
      pdf.setTextColor(...colors.text);
      
      // Use splitTextToSize to wrap long values - with better width calculation
      const maxWidth = colWidth - 10;
      const valueLines = pdf.splitTextToSize(displayValue, maxWidth);
      let valueY = boxY + 6;
      valueLines.forEach((line) => {
        pdf.text(line, boxX, valueY);
        valueY += 6;
      });
    });

    y += boxHeight + 8;

    /* --- Budget as Separate Section --- */
    if (selectedPolicy.budget) {
      checkPage(30);
      
      // Section Header
      pdf.setFillColor(...colors.primary);
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");

      pdf.setFontSize(13);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.white);
      pdf.text("BUDGET ALLOCATION", margin + 5, y + 6.5);

      pdf.setDrawColor(...colors.primaryLight);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y + 11, pageWidth - margin, y + 11);

      y += 16;

      // Styled Budget Box
      pdf.setFillColor(...colors.background);
      pdf.setDrawColor(...colors.accent);
      pdf.setLineWidth(1.5);
      
      // Calculate box height dynamically based on content
      const budgetLines = pdf.splitTextToSize(selectedPolicy.budget, contentWidth - 12);
      const budgetBoxHeight = (budgetLines.length * 6.5) + 12;
      
      pdf.rect(margin, y, contentWidth, budgetBoxHeight);

      // Budget content
      pdf.setFontSize(11);
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(...colors.accent);
      pdf.text("Amount:", margin + 6, y + 7);

      pdf.setFontSize(10);
      pdf.setFont("Helvetica", "normal");
      pdf.setTextColor(...colors.text);
      
      let budgetY = y + 13;
      budgetLines.forEach((line) => {
        pdf.text(line, margin + 6, budgetY);
        budgetY += 6.5;
      });

      y += budgetBoxHeight + 10;
    }

    /* ---------- CONTENT SECTIONS ---------- */

    if (selectedPolicy.objectives?.length) {
      sectionHeader("OBJECTIVES");
      bulletList(selectedPolicy.objectives);
    }

    if (selectedPolicy.benefits?.length) {
      sectionHeader("KEY BENEFITS");
      bulletList(selectedPolicy.benefits);
    }

    if (selectedPolicy.keyHighlights?.length) {
      sectionHeader("KEY HIGHLIGHTS");
      bulletList(selectedPolicy.keyHighlights);
    }

    if (selectedPolicy.targetAudience) {
      sectionHeader("TARGET AUDIENCE");
      paragraph(selectedPolicy.targetAudience);
    }

    if (selectedPolicy.implementation) {
      sectionHeader("IMPLEMENTATION STRATEGY");
      paragraph(selectedPolicy.implementation);
    }

    if (selectedPolicy.parliamentDiscussions) {
      sectionHeader("PARLIAMENT DISCUSSIONS");
      paragraph(selectedPolicy.parliamentDiscussions);
    }

    if (selectedPolicy.debates?.length) {
      sectionHeader("KEY DEBATES & DISCUSSIONS");
      bulletList(selectedPolicy.debates);
    }

    if (selectedPolicy.amendments?.length) {
      sectionHeader("AMENDMENTS");
      bulletList(selectedPolicy.amendments);
    }

    if (selectedPolicy.challenges?.length) {
      sectionHeader("IMPLEMENTATION CHALLENGES");
      bulletList(selectedPolicy.challenges);
    }

    if (selectedPolicy.futureProspects) {
      sectionHeader("FUTURE PROSPECTS & VISION");
      paragraph(selectedPolicy.futureProspects);
    }

    /* --- OFFICIAL SOURCES DOCUMENTATION SECTION --- */
    if (selectedPolicy.sourceDocumentation?.sources && selectedPolicy.sourceDocumentation.sources.length > 0) {
      sectionHeader("OFFICIAL SOURCES DOCUMENTATION");
      
      // Introduction text
      paragraph("This policy content is sourced from official government websites. Below is a detailed breakdown of the sources used:", 10, true);
      
      // Add each source as a structured box
      selectedPolicy.sourceDocumentation.sources.forEach((source, idx) => {
        checkPage(35);
        
        // Source header with percentage
        pdf.setFillColor(...colors.success);
        pdf.roundedRect(margin, y, contentWidth, 8, 1, 1, "F");
        
        pdf.setFontSize(10);
        pdf.setFont("Helvetica", "bold");
        pdf.setTextColor(...colors.white);
        pdf.text(`Source ${idx + 1}: ${source.sourceName}`, margin + 4, y + 5);
        
        // Percentage badge
        const percentText = `${source.percentageOfData || 0}%`;
        const percentWidth = pdf.getStringUnitWidth(percentText) * 10 / pdf.internal.scaleFactor + 6;
        pdf.setFillColor(...colors.primary);
        pdf.roundedRect(pageWidth - margin - percentWidth, y, percentWidth, 8, 1, 1, "F");
        pdf.setTextColor(...colors.white);
        pdf.text(percentText, pageWidth - margin - percentWidth / 2, y + 5, { align: "center" });
        
        y += 10;
        
        // Source details in a box
        pdf.setDrawColor(...colors.border);
        pdf.setLineWidth(0.5);
        pdf.rect(margin + 2, y, contentWidth - 4, 45);
        
        // Source type
        pdf.setFontSize(9);
        pdf.setFont("Helvetica", "bold");
        pdf.setTextColor(...colors.textLight);
        pdf.text("Type: ", margin + 6, y + 5);
        
        pdf.setFont("Helvetica", "normal");
        pdf.text(source.sourceType || "Government Source", margin + 18, y + 5);
        
        // Source URL
        pdf.setFont("Helvetica", "bold");
        pdf.setTextColor(...colors.textLight);
        pdf.text("URL: ", margin + 6, y + 12);
        
        pdf.setFont("Helvetica", "normal");
        pdf.setTextColor(...colors.accent);
        const urlLines = pdf.splitTextToSize(source.sourceURL || "N/A", contentWidth - 24);
        pdf.text(urlLines[0], margin + 18, y + 12);
        if (urlLines[1]) {
          pdf.text(urlLines[1], margin + 18, y + 18);
        }
        
// Data parts covered
pdf.setFont("Helvetica", "bold");
pdf.setTextColor(...colors.textLight);

const label = "Data Covered: ";
const labelX = margin + 6;
const dataPartsY = urlLines[1] ? y + 24 : y + 18;

// Draw label
pdf.text(label, labelX, dataPartsY);

// 🔥 Calculate exact label width
const fontSize = 9; // your current font size
pdf.setFontSize(fontSize);

const labelWidth =
  pdf.getStringUnitWidth(label) * fontSize / pdf.internal.scaleFactor;

const valueX = labelX + labelWidth + 4; // 4 = small gap

if (source.dataParts && source.dataParts.length > 0) {
  pdf.setFont("Helvetica", "normal");
  pdf.setTextColor(...colors.text);

  const dataText = source.dataParts.join(", ");
  const dataLines = pdf.splitTextToSize(
    dataText,
    contentWidth - (valueX - margin)
  );

  dataLines.forEach((line, lineIdx) => {
    pdf.text(line, valueX, dataPartsY + (lineIdx * 6));
  });
} else {
  pdf.setFont("Helvetica", "italic");
  pdf.setTextColor(...colors.textLight);
  pdf.text("Multiple sections covered", valueX, dataPartsY);
}
        
        y += 48;
        y += 4;
      });
    }

    if (selectedPolicy.content) {
      sectionHeader("DETAILED POLICY CONTENT");
      paragraph(selectedPolicy.content, 9.5);
    }

    addFooter();

    pdf.save(
      `${selectedPolicy.title.replace(/[^a-z0-9]/gi, "_")}.pdf`
    );
    setPdfGenerated(true);
  } catch (err) {
    console.error("PDF error:", err);
    setError("PDF generation failed");
  } finally {
    setGeneratingPdf(false);
  }
}, [selectedPolicy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 overflow-hidden">
      {/* Enhanced Background blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-60"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate("/dashboard", { state: { skipIntro: true } })}
          className="mb-8 flex items-center gap-2 text-white font-semibold hover:text-cyan-300 transition-colors duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Dashboard
        </motion.button>

        {/* Enhanced Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <motion.div 
              animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className="text-5xl md:text-6xl text-cyan-400 filter drop-shadow-lg select-none icon-pulse"
            >
              <FaFileAlt />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-0 gradient-text-cyan-purple drop-shadow-md leading-tight pb-2 header-glow">
              Reports & Sharing
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Generate comprehensive PDF reports of government policies with professional styling and easy sharing
          </p>
        </motion.div>

        {/* Enhanced Search Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="relative">
            <div className="report-card-premium p-8 rounded-2xl">
              <label className="block text-white font-bold text-lg mb-4">
                Search & Select Policy
              </label>

              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Type policy name to search... (e.g., 'Education', 'Healthcare')"
                  className="w-full px-6 py-4 search-input-enhanced rounded-xl text-white placeholder-gray-400 focus:outline-none text-base font-medium"
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 animate-spin">
                    <FaSpinner className="text-xl" />
                  </div>
                )}
              </div>

              {/* Enhanced Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-24 left-0 right-0 bg-gray-800/95 backdrop-blur-xl border border-purple-500/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                  {suggestions.map((policy, idx) => (
                    <motion.button
                      key={policy._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handlePolicySelect(policy)}
                      className="w-full text-left px-6 py-4 hover:bg-purple-600/40 border-b border-purple-500/20 transition-all duration-300 group"
                    >
                      <p className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">{policy.title}</p>
                      <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-300">{policy.ministry} • {policy.category}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm font-medium">❌ {error}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Selected Policy Preview */}
        {selectedPolicy && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 space-y-6">
            {/* Enhanced Policy Header */}
            <div className="report-card-premium rounded-2xl p-8 border border-purple-500/40">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{selectedPolicy.title}</h2>
                  <span className="badge-premium">Policy Report</span>
                </div>
              </div>

              {/* {selectedPolicy.summary && (
                <div className="info-box-accent mt-6">
                  <p className="text-cyan-300 font-bold text-sm mb-2 flex items-center gap-2">
                    <FaLightbulb className="text-cyan-400" /> Executive Summary
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed break-words whitespace-normal">{selectedPolicy.summary}</p>
                </div>
              )} */}
            </div>

            {/* Enhanced Budget Details Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="detail-card-enhanced border-l-4 border-indigo-500">
              <h3 className="text-indigo-300 font-bold text-lg mb-4 flex items-center gap-2">
                <FaCog className="text-indigo-400 text-xl" /> Policy Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/40 rounded-lg p-4 hover:bg-gray-900/60 transition-colors duration-300">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Ministry</p>
                  <p className="text-cyan-300 font-semibold break-words">{selectedPolicy.ministry}</p>
                </div>
                <div className="bg-gray-900/40 rounded-lg p-4 hover:bg-gray-900/60 transition-colors duration-300">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Category</p>
                  <p className="text-purple-300 font-semibold break-words">{selectedPolicy.category}</p>
                </div>
                <div className="bg-gray-900/40 rounded-lg p-4 hover:bg-gray-900/60 transition-colors duration-300">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Budget</p>
                  <p className="text-pink-300 font-semibold break-words">{selectedPolicy.budget || "N/A"}</p>
                </div>
                <div className="bg-gray-900/40 rounded-lg p-4 hover:bg-gray-900/60 transition-colors duration-300">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Issued</p>
                  <p className="text-green-300 font-semibold break-words">{new Date(selectedPolicy.issueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>

            {/* Official Sources Documentation */}
            {selectedPolicy.sourceDocumentation?.sources && selectedPolicy.sourceDocumentation.sources.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="detail-card-enhanced border-l-4 border-emerald-500">
                <h3 className="text-emerald-300 font-bold text-lg mb-4 flex items-center gap-2">
                  🔍 Official Sources Documentation
                </h3>
                <p className="text-gray-300 text-sm mb-4">This policy is sourced from official government websites. Below is the detailed breakdown:</p>
                <div className="space-y-4">
                  {selectedPolicy.sourceDocumentation.sources.map((source, idx) => (
                    <div key={idx} className="bg-gray-900/40 rounded-lg p-4 border border-emerald-500/30 hover:border-emerald-400/60 transition-colors duration-300">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2">
                            <span className="bg-emerald-500/30 rounded-full text-xs text-emerald-300 font-bold px-2 py-1">Source {idx + 1}</span>
                            {source.sourceName}
                          </h4>
                          <p className="text-gray-400 text-xs">{source.sourceType}</p>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-3 py-1 rounded-lg text-sm text-center whitespace-nowrap">
                          {source.percentageOfData || 0}%
                        </div>
                      </div>
                      {source.sourceURL && (
                        <div className="mb-3">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">📍 Official URL</p>
                          <a href={source.sourceURL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs break-all underline">
                            {source.sourceURL}
                          </a>
                        </div>
                      )}
                      {source.dataParts && source.dataParts.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">📋 Data Covered</p>
                          <div className="flex flex-wrap gap-2">
                            {source.dataParts.map((part, i) => (
                              <span key={i} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs font-semibold">
                                {part}
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

            {/* Enhanced PDF Generation Status */}
            <div className="report-card-premium border-l-4 border-cyan-500 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    <FaRocket className="text-cyan-400 animate-bounce" /> PDF Report Ready
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {pdfGenerated ? (
                      <span className="text-green-400 font-medium flex items-center gap-2">
                        <FaCheckCircle /> PDF generated successfully
                      </span>
                    ) : (
                      "Click the button to generate a comprehensive professional PDF report"
                    )}
                  </p>
                </div>
                <motion.button
                  onClick={generatePDF}
                  disabled={generatingPdf}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg whitespace-nowrap transition-all ${
                    generatingPdf
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "btn-gradient-cyan-purple text-white shadow-neon-cyan hover:shadow-neon-purple"
                  }`}
                >
                  {generatingPdf ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" /> Generating...
                    </>
                  ) : pdfGenerated ? (
                    <>
                      <FaCheckCircle className="animate-check-mark" /> Generated
                    </>
                  ) : (
                    <>
                      <FaDownload /> Generate PDF
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Enhanced Policy Details Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedPolicy.objectives && selectedPolicy.objectives.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="detail-card-enhanced border-l-4 border-blue-500 group">
                  <h3 className="text-blue-300 font-bold text-lg mb-4 flex items-center gap-2">
                    <FaBullseye className="text-blue-400 text-xl group-hover:scale-110 transition-transform" /> Objectives ({selectedPolicy.objectives.length})
                  </h3>
                  <ul className="space-y-3">
                    {selectedPolicy.objectives.slice(0, 3).map((obj, idx) => (
                      <li key={idx} className="text-gray-200 text-sm flex gap-3 list-item-animated">
                        <FaCheck className="text-blue-400 flex-shrink-0 mt-0.5 text-xs" />
                        <span className="break-words leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {selectedPolicy.benefits && selectedPolicy.benefits.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="detail-card-enhanced border-l-4 border-green-500 group">
                  <h3 className="text-green-300 font-bold text-lg mb-4 flex items-center gap-2">
                    <FaStar className="text-green-400 text-xl group-hover:spin transition-transform" /> Key Benefits ({selectedPolicy.benefits.length})
                  </h3>
                  <ul className="space-y-3">
                    {selectedPolicy.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="text-gray-200 text-sm flex gap-3 list-item-animated">
                        <FaStar className="text-green-400 flex-shrink-0 mt-0.5 text-xs" />
                        <span className="break-words leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {selectedPolicy.challenges && selectedPolicy.challenges.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="detail-card-enhanced border-l-4 border-amber-500 group">
                  <h3 className="text-amber-300 font-bold text-lg mb-4 flex items-center gap-2">
                    <FaExclamationTriangle className="text-amber-400 text-xl group-hover:animate-wiggle" /> Challenges ({selectedPolicy.challenges.length})
                  </h3>
                  <ul className="space-y-3">
                    {selectedPolicy.challenges.slice(0, 3).map((challenge, idx) => (
                      <li key={idx} className="text-gray-200 text-sm flex gap-3 list-item-animated">
                        <span className="text-amber-400 flex-shrink-0">●</span>
                        <span className="break-words leading-relaxed">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {selectedPolicy.debates && selectedPolicy.debates.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="detail-card-enhanced border-l-4 border-red-500 group">
                  <h3 className="text-red-300 font-bold text-lg mb-4 flex items-center gap-2">
                    <FaComments className="text-red-400 text-xl group-hover:bounce" /> Debates ({selectedPolicy.debates.length})
                  </h3>
                  <ul className="space-y-3">
                    {selectedPolicy.debates.slice(0, 3).map((debate, idx) => (
                      <li key={idx} className="text-gray-200 text-sm flex gap-3 list-item-animated">
                        <span className="text-red-400 font-bold flex-shrink-0">◆</span>
                        <span className="break-words leading-relaxed">{debate}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Enhanced Document Info */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="font-bold text-white text-base flex items-center gap-2 mb-2">
                  <FaFileAlt className="text-cyan-400" /> Document Information
                </span>
                The generated PDF will include all comprehensive sections: Executive Summary, Objectives, Key Benefits, Key Highlights, Target Audience, Implementation Strategy, Parliament Discussions, Debates & Discussions, Amendments, Implementation Challenges, Future Prospects & Vision, and Detailed Policy Content.
              </p>
            </div>
          </motion.div>
        )}

        {/* Enhanced Empty State */}
        {!selectedPolicy && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-20 px-4"
          >
            <p className="text-gray-300 text-xl font-semibold mb-3">Start Your Report Journey</p>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Search and select a policy from the search box above to generate a professional PDF report with complete details and analysis.
            </p>
            <div className="divider-gradient mt-8 mb-0 max-w-xs mx-auto"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportSharing;
