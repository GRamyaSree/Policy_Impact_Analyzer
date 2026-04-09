import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaTrophy,
  FaChartBar,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaFire,
  FaFilter,
  FaMedal,
  FaUsers,
  FaChartPie,
  FaSlidersH,
  FaIndustry,
  FaChartLine,
  FaBuilding,
  FaMoneyBill,
  FaSearch,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ImpactScoreCard = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("impact-ranking");

  // TAB 1: Filters
  const [filterSector, setFilterSector] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("");
  const [filterBudgetRange, setFilterBudgetRange] = useState([0, 500000]); // 0 to 500,000 million (50000 crores)
  const [filterYear, setFilterYear] = useState("");
  const [filterBeneficiary, setFilterBeneficiary] = useState("");

  // TAB 4: Analytics filters
  const [analyticsChartType, setAnalyticsChartType] = useState("growth-timeline");
  const [analyticsSector, setAnalyticsSector] = useState("");
  const [analyticsYear, setAnalyticsYear] = useState("");
  const [analyticsBudgetRange, setAnalyticsBudgetRange] = useState([0, 500000]);

  // ============ SECTOR GROUPING LOGIC ============
  // Map granular categories to broader sectors
  const categoryToSectorMap = {
    "Education": "Education",
    "Education & Child Rights": "Education",
    "Education & Financial Aid": "Education",
    "Education & Technology": "Education",
    "Education Equity & Quality": "Education",
    "Education & Rights": "Education",
    "Skill Development & Employment": "Skills & Employment",
    "Employment & Rural Development": "Skills & Employment",
    "Employment Generation": "Skills & Employment",
    "Apprenticeship & Skill Training": "Skills & Employment",
    "Apprenticeship & Worker Protection": "Skills & Employment",
    "Skill Training": "Skills & Employment",
    "Health": "Healthcare",
    "Health & Social Security": "Healthcare",
    "Health & Vaccination": "Healthcare",
    "Health & Wellness": "Healthcare",
    "Healthcare & Tertiary Care": "Healthcare",
    "Maternal Health & Women Welfare": "Healthcare",
    "Maternal & Child Nutrition": "Healthcare",
    "Childhood Immunization": "Healthcare",
    "Child Nutrition & Education": "Healthcare",
    "Cancer Prevention & Treatment": "Healthcare",
    "Occupational Health": "Healthcare",
    "Mental Health & Wellbeing": "Healthcare",
    "Mental Health & Wellness": "Healthcare",
    "NCD Prevention & Screening": "Healthcare",
    "Nutrition & Child Health": "Healthcare",
    "Traditional & Holistic Healthcare": "Healthcare",
    "Pharmaceuticals & Healthcare Manufacturing": "Healthcare",
    "Agriculture": "Agriculture & Rural",
    "Agriculture & Water": "Agriculture & Rural",
    "Animal Husbandry & Dairy": "Agriculture & Rural",
    "Agricultural Innovation & Technology": "Agriculture & Rural",
    "Agricultural Insurance": "Agriculture & Rural",
    "Agricultural Market Infrastructure": "Agriculture & Rural",
    "Fisheries & Aquaculture": "Agriculture & Rural",
    "Fisheries & Nutrition": "Agriculture & Rural",
    "Food Security & Nutrition": "Agriculture & Rural",
    "Food Security & Public Distribution": "Agriculture & Rural",
    "Rural Infrastructure": "Agriculture & Rural",
    "Rural Development": "Agriculture & Rural",
    "Rural Livelihood & Poverty": "Agriculture & Rural",
    "Rural Services & Connectivity": "Agriculture & Rural",
    "Finance & Banking": "Finance & Commerce",
    "Finance & Entrepreneurship": "Finance & Commerce",
    "Financial Inclusion & Banking": "Finance & Commerce",
    "Entrepreneurship & Innovation": "Finance & Commerce",
    "Entrepreneurship & Microfinance": "Finance & Commerce",
    "Life Insurance & Protection": "Finance & Commerce",
    "Social Security & Savings": "Finance & Commerce",
    "Digital Commerce": "Finance & Commerce",
    "Digital Trade & E-commerce": "Finance & Commerce",
    "Informal Trade Support": "Finance & Commerce",
    "Technology & Infrastructure": "Technology & Infrastructure",
    "Telecommunications & Infrastructure": "Technology & Infrastructure",
    "Transportation & Aviation": "Technology & Infrastructure",
    "Transportation & Infrastructure": "Technology & Infrastructure",
    "Digital Governance & Welfare": "Technology & Infrastructure",
    "Cybersecurity & Data Protection": "Technology & Infrastructure",
    "Infrastructure": "Technology & Infrastructure",
    "Housing & Urban Development": "Technology & Infrastructure",
    "Water Resource Management": "Technology & Infrastructure",
    "Energy": "Energy & Environment",
    "Energy Access & Sustainability": "Energy & Environment",
    "Energy & Climate Action": "Energy & Environment",
    "Energy & Health": "Energy & Environment",
    "Energy Access & Health": "Energy & Environment",
    "Renewable Energy & Affordability": "Energy & Environment",
    "Renewable Energy & Climate": "Energy & Environment",
    "Environment & Climate Action": "Energy & Environment",
    "Biodiversity & Conservation": "Energy & Environment",
    "Forestry & Afforestation": "Energy & Environment",
    "Sanitation & Public Health": "Energy & Environment",
    "Women Empowerment & Gender": "Social Welfare & Inclusion",
    "Women Empowerment & Skill Development": "Social Welfare & Inclusion",
    "Disability Rights & Inclusion": "Social Welfare & Inclusion",
    "Senior Citizen Welfare & Health": "Social Welfare & Inclusion",
    "Senior Citizen Pension": "Social Welfare & Inclusion",
    "Pension & Social Security": "Social Welfare & Inclusion",
    "Social Security & Pensions": "Social Welfare & Inclusion",
    "Social Relief & Emergency": "Social Welfare & Inclusion",
    "Labour Rights & Worker Protection": "Social Welfare & Inclusion",
    "Labor Rights & Workplace Safety": "Social Welfare & Inclusion",
    "Consumer Protection & Justice": "Social Welfare & Inclusion",
    "Justice & Digitalization": "Social Welfare & Inclusion",
    "Justice & Victim Support": "Social Welfare & Inclusion",
    "Manufacturing & Industrial": "Manufacturing & Commerce",
    "Textile & Manufacturing": "Manufacturing & Commerce",
    "Mineral Resources Development": "Manufacturing & Commerce",
    "Economic Self-Reliance": "Manufacturing & Commerce",
    "Tourism & Heritage": "Culture & Heritage",
    "Culture & Heritage Protection": "Culture & Heritage",
    "Sports Development": "Culture & Heritage",
    "Science & Research": "Science & Innovation",
    "Science & Earth Monitoring": "Science & Innovation",
    "Space & Science": "Science & Innovation",
    "Disaster Management": "Disaster & Safety",
    "Disaster Management & Infrastructure": "Disaster & Safety",
    "Disaster & Natural Resource Management": "Disaster & Safety",
    "Governance & Participation": "Governance",
    "Public Finance & Governance": "Governance",
  };

  const getSector = (category) => {
    return categoryToSectorMap[category] || category;
  };

  // ============ BENEFICIARY EXTRACTION LOGIC ============
  // Extract beneficiary types from policies based on targetAudience and benefits
  const extractBeneficiaries = (policy) => {
    const beneficiaryKeywords = {
      Students: ["student", "pupil", "learner", "scholar", "education"],
      Farmers: ["farmer", "agricultural", "farming", "cultivator", "agri"],
      Women: ["women", "woman", "female", "girl", "homemaker", "mother"],
      MSMEs: ["msme", "small business", "entrepreneur", "startup", "small enterprise"],
      "Senior Citizens": ["senior citizen", "elderly", "senior", "aged", "retirement", "pensioner"],
      "Rural Population": ["rural", "village", "countryside", "remote area", "gram panchayat"],
      "Urban Poor": ["urban poor", "slum", "economically weak", "below poverty", "low income"],
      Startups: ["startup", "innovation", "entrepreneur", "new venture", "incubation"],
      "Healthcare Workers": ["healthcare", "doctor", "nurse", "medical", "health worker", "frontline"],
      "Unorganized Workers": ["unorganized", "informal", "daily wage", "gig"],
      "SC/ST Communities": ["sc", "st", "dalit", "backward", "scheduled caste", "scheduled tribe"],
      "Children": ["children", "child", "kid", "minor", "juvenile", "infant"],
      "Persons with Disabilities": ["disability", "disabled", "pwd", "accessibility", "blindness", "deafness"],
      "Minorities": ["minority", "religious", "muslim", "christian", "sikh", "jain"],
    };

    const text = `${policy.targetAudience || ""} ${(policy.benefits || []).join(" ")} ${(policy.objectives || []).join(" ")}`.toLowerCase();

    const extracted = [];
    for (const [group, keywords] of Object.entries(beneficiaryKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        extracted.push(group);
      }
    }

    return extracted.length > 0 ? extracted : ["General Population"];
  };

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/policies");
      console.log("📊 Policies received from API:", res.data?.length || 0, "policies");
      setPolicies(res.data || []);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch policies. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchPolicies();
    }, 120000); // Refresh every 2 minutes to prevent page jumping
    return () => clearInterval(id);
  }, [fetchPolicies]);

  // ============ NEW SCORING LOGIC ============
  const computeImpactScore = (policy) => {
    const safeLen = (v) => (Array.isArray(v) ? v.length : v ? 1 : 0);

    // Extract numbers
    const budget = Number(String(policy.budget).replace(/[^0-9.-]+/g, "")) || 0;
    const contentLen = (policy.content || "").length;
    // Count beneficiary keywords in targetAudience as proxy for beneficiaries
    const targetAudienceKeywords = (policy.targetAudience || "").toLowerCase().split(/\s+/).length;
    const numBeneficiaries = Math.max(1, targetAudienceKeywords / 5); // Rough estimate from text length
    const numObjectives = safeLen(policy.objectives) || 1;
    const numChallenges = safeLen(policy.challenges) || 0;
    const numDebates = safeLen(policy.debates) || 0;
    const numBenefits = safeLen(policy.benefits) || 0;

    // Normalize against all policies
    const maxBudget = Math.max(...policies.map((p) => Number(String(p.budget).replace(/[^0-9.-]+/g, "")) || 0), 1);
    const maxContent = Math.max(...policies.map((p) => (p.content || "").length), 1);
    const maxBeneficiaries = Math.max(
      ...policies.map((p) => Math.max(1, (p.targetAudience || "").toLowerCase().split(/\s+/).length / 5)),
      1
    );

    // 1. Policy Coverage Weight (20%)
    const policyCoverageWeight = (contentLen / maxContent) * 0.5 + (numObjectives / 10) * 0.5;

    // 2. Beneficiary Reach (20%)
    const beneficiaryReach = Math.tanh(numBeneficiaries / maxBeneficiaries);

    // 3. Sector Importance (15%) - based on existence of key highlights
    const sectorImportance = (safeLen(policy.keyHighlights) > 0 ? 1 : 0.5);

    // 4. Budget Allocation (20%)
    const budgetAllocation = budget / maxBudget;

    // 5. Implementation Scale (15%) - based on debates, benefits and discussions
    const implementationScale = Math.tanh((numDebates + numBenefits) / 10);

    // 6. Complexity Reduction % (10%) - inverse of challenges
    const complexityReduction = Math.max(0, 1 - (numChallenges / 10));

    // Calculate final score
    const rawScore =
      policyCoverageWeight * 0.2 +
      beneficiaryReach * 0.2 +
      sectorImportance * 0.15 +
      budgetAllocation * 0.2 +
      implementationScale * 0.15 +
      complexityReduction * 0.1;

    const finalScore = Math.max(0, Math.min(1, rawScore)) * 100;

    return {
      score: Math.round(finalScore),
      components: {
        policyCoverageWeight: Math.round(policyCoverageWeight * 100),
        beneficiaryReach: Math.round(beneficiaryReach * 100),
        sectorImportance: Math.round(sectorImportance * 100),
        budgetAllocation: Math.round(budgetAllocation * 100),
        implementationScale: Math.round(implementationScale * 100),
        complexityReduction: Math.round(complexityReduction * 100),
      },
    };
  };

  // Compute scores for all policies
  const scoredPolicies = useMemo(() => {
    const scored = policies
      .map((p) => ({
        ...p,
        sector: getSector(p.category),
        extractedBeneficiaries: extractBeneficiaries(p),
        impactScore: computeImpactScore(p),
      }))
      .sort((a, b) => b.impactScore.score - a.impactScore.score);
    console.log("📈 Scored policies:", scored.length);
    return scored;
  }, [policies]);

  // Get unique values for filters
  const sectors = useMemo(
    () => [...new Set(scoredPolicies.map((p) => p.sector || "Uncategorized"))].sort(),
    [scoredPolicies]
  );
  const ministries = useMemo(
    () => [...new Set(scoredPolicies.map((p) => p.ministry || "Unknown"))],
    [scoredPolicies]
  );
  const years = useMemo(() => {
    const yearSet = new Set();
    scoredPolicies.forEach((p) => {
      if (p.issueDate) {
        const year = new Date(p.issueDate).getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [scoredPolicies]);

  // Beneficiary types
  const allBeneficiaryTypes = useMemo(() => {
    const types = new Set();
    scoredPolicies.forEach((p) => {
      if (Array.isArray(p.extractedBeneficiaries)) {
        p.extractedBeneficiaries.forEach((b) => types.add(b));
      }
    });
    return Array.from(types).sort();
  }, [scoredPolicies]);

  // Apply filters
  const filteredPolicies = useMemo(() => {
    const filtered = scoredPolicies.filter((p) => {
      if (filterSector && p.sector !== filterSector) return false;
      if (filterMinistry && p.ministry !== filterMinistry) return false;
      if (filterYear && new Date(p.issueDate).getFullYear() !== parseInt(filterYear)) return false;
      if (filterBeneficiary && !Array.isArray(p.extractedBeneficiaries)) return false;
      if (filterBeneficiary && !p.extractedBeneficiaries.includes(filterBeneficiary)) return false;

      // Budget range (in millions, 0-100)
      const budgetNum = Number(String(p.budget).replace(/[^0-9.-]+/g, "")) || 0;
      const budgetMillion = budgetNum / 1000000;
      if (budgetMillion < filterBudgetRange[0] || budgetMillion > filterBudgetRange[1]) return false;

      return true;
    });
    console.log("🔍 Filtered policies:", filtered.length, "| Filters:", { filterSector, filterMinistry, filterYear, filterBeneficiary, filterBudgetRange });
    return filtered;
  }, [scoredPolicies, filterSector, filterMinistry, filterYear, filterBeneficiary, filterBudgetRange]);

  // Apply analytics filters (TAB 4)
  const analyticsFilteredPolicies = useMemo(() => {
    const filtered = scoredPolicies.filter((p) => {
      if (analyticsSector && p.sector !== analyticsSector) return false;
      if (analyticsYear && new Date(p.issueDate).getFullYear() !== parseInt(analyticsYear)) return false;

      // Budget range (in millions)
      const budgetNum = Number(String(p.budget).replace(/[^0-9.-]+/g, "")) || 0;
      const budgetMillion = budgetNum / 1000000;
      if (budgetMillion < analyticsBudgetRange[0] || budgetMillion > analyticsBudgetRange[1]) return false;

      return true;
    });
    return filtered;
  }, [scoredPolicies, analyticsSector, analyticsYear, analyticsBudgetRange]);

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard", { state: { skipIntro: true } })}
          className="mb-8 flex items-center gap-2 text-white font-semibold hover:text-purple-300 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-4xl md:text-5xl text-yellow-400 filter drop-shadow-md select-none mr-3">
              <FaChartBar />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md leading-tight pb-2">
              Impact Scorecard
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto -mt-5">
            Advanced policy impact analysis with comprehensive scoring, sector insights & beneficiary reach
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-3 bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/30">
          {[
            { id: "impact-ranking", label: "Impact Ranking", icon: FaTrophy },
            { id: "sector-distribution", label: "Sector-wise", icon: FaIndustry },
            { id: "beneficiary", label: "Beneficiary Analysis", icon: FaUsers },
            { id: "analytics", label: "Visual Analytics", icon: FaChartBar },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-800/50 text-gray-300 hover:text-white border border-purple-500/20"
              }`}
            >
              <tab.icon /> {tab.label}
            </motion.button>
          ))}
        </div>

        {error && <div className="bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4 mb-6 text-red-300">{error}</div>}
        {loading && <p className="text-gray-400 text-center py-12">Loading policies...</p>}

        {/* TAB 1: Impact Ranking */}
        {activeTab === "impact-ranking" && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Top 3 Highlight Panel - Shows top 3 of filtered results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => {
                // Show top 3 of FILTERED policies
                const topThree = filteredPolicies.slice(0, 3);

                if (topThree.length === 0) {
                  return <p className="text-white col-span-3 text-center py-4">No policies match your filters</p>;
                }

                return topThree.map((p, idx) => {
                  const rankIcons = [FaTrophy, FaMedal, FaMedal];
                  const rankLabels = ["1st", "2nd", "3rd"];
                  const colors = [
                    "from-yellow-500 to-yellow-600",
                    "from-gray-400 to-gray-500",
                    "from-orange-600 to-orange-700",
                  ];
                  const RankIcon = rankIcons[idx];
                  return (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`relative bg-gradient-to-br ${colors[idx]} rounded-2xl p-6 text-white overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 text-6xl opacity-20"><RankIcon /></div>
                      <p className="text-3xl font-black mb-2 flex items-center gap-2"><RankIcon /> {rankLabels[idx]}</p>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{p.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{p.ministry}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Impact Score</span>
                        <span className="text-3xl font-black">{p.impactScore.score}</span>
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>

            {/* Filter Panel */}
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaFilter className="text-cyan-400" /> Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Sector Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Sector</label>
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none focus:border-purple-300"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ministry Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Ministry</label>
                  <select
                    value={filterMinistry}
                    onChange={(e) => setFilterMinistry(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none focus:border-purple-300"
                  >
                    <option value="">All Ministries</option>
                    {ministries.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Budget Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filterBudgetRange[0]}
                      onChange={(e) => setFilterBudgetRange([Number(e.target.value), filterBudgetRange[1]])}
                      className="w-1/2 px-2 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filterBudgetRange[1]}
                      onChange={(e) => setFilterBudgetRange([filterBudgetRange[0], Number(e.target.value)])}
                      className="w-1/2 px-2 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Year</label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none focus:border-purple-300"
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Beneficiary Type Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Beneficiary Type</label>
                  <select
                    value={filterBeneficiary}
                    onChange={(e) => setFilterBeneficiary(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none focus:border-purple-300"
                  >
                    <option value="">All Types</option>
                    {allBeneficiaryTypes.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilterSector("");
                  setFilterMinistry("");
                  setFilterBudgetRange([0, 500000]);
                  setFilterYear("");
                  setFilterBeneficiary("");
                }}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                ✕ Clear Filters
              </button>
            </div>

            {/* Ranking Table */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-400" /> All Policies ({filteredPolicies.length} results)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-900/80 z-10">
                    <tr className="border-b border-purple-500/30">
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Rank</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Policy Name</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Sector</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Ministry</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Beneficiaries</th>
                    <th className="text-right px-4 py-3 text-cyan-400 font-bold">Impact Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    if (filteredPolicies.length === 0) {
                      return (
                        <tr>
                          <td colSpan="6" className="text-center text-gray-400 py-8">
                            No policies match your filters. Try adjusting the filters.
                          </td>
                        </tr>
                      );
                    }

                    return filteredPolicies.map((p, idx) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.001 }}
                        className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-300 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 text-white font-semibold">{p.title}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{p.sector}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{p.ministry}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {p.extractedBeneficiaries.slice(0, 2).map((b) => (
                              <span key={b} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs whitespace-nowrap">
                                {b}
                              </span>
                            ))}
                            {p.extractedBeneficiaries.length > 2 && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                +{p.extractedBeneficiaries.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg">
                            {p.impactScore.score}
                          </span>
                        </td>
                      </motion.tr>
                    ));
                  })()}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Sector-wise Distribution */}
        {activeTab === "sector-distribution" && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Donut Chart */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaIndustry className="text-cyan-400" /> Policy Distribution Across Sectors
              </h2>
              <div style={{ height: "400px", overflow: "hidden" }}>
                {scoredPolicies.length > 0 && (
                  <Doughnut
                    data={{
                      labels: sectors,
                      datasets: [
                        {
                          data: sectors.map((s) => scoredPolicies.filter((p) => p.sector === s).length),
                          backgroundColor: ["#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#14B8A6", "#6366F1", "#8855FF"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: "#fff" }, position: "bottom", padding: 15 },
                      },
                    }}
                  />
                )}
                {scoredPolicies.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaChartBar className="text-5xl text-gray-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400 text-lg font-semibold mb-2">No sector data available</p>
                      <p className="text-gray-500">Policies are loading or no data exists</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sector Ranking Table */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl overflow-x-auto">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaChartBar className="text-purple-400" /> Sector Impact Ranking
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Sector</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Number of Policies</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Average Impact Score</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sectors
                    .map((sector) => {
                      const sectorPolicies = scoredPolicies.filter((p) => p.sector === sector);
                      const avgScore = Math.round(
                        sectorPolicies.reduce((sum, p) => sum + p.impactScore.score, 0) / sectorPolicies.length
                      );
                      return { sector, count: sectorPolicies.length, avgScore, policies: sectorPolicies };
                    })
                    .sort((a, b) => b.avgScore - a.avgScore)
                    .map((item, idx) => (
                      <tr key={item.sector} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                        <td className="px-4 py-3 text-white font-bold">{item.sector}</td>
                        <td className="px-4 py-3 text-gray-300">{item.count}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg">
                            {item.avgScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-green-400 font-bold flex items-center gap-2"><FaChartLine /> Growing</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Beneficiary Analysis */}
        {activeTab === "beneficiary" && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Beneficiary Coverage Chart */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl h-96">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaUsers className="text-blue-400" /> Policy Coverage by Beneficiary Type
              </h2>
              {scoredPolicies.length > 0 && allBeneficiaryTypes.length > 0 && (
                <Bar
                  data={{
                    labels: allBeneficiaryTypes,
                    datasets: [
                      {
                        label: "Number of Policies",
                        data: allBeneficiaryTypes.map(
                          (b) => scoredPolicies.filter((p) => Array.isArray(p.extractedBeneficiaries) && p.extractedBeneficiaries.includes(b)).length
                        ),
                        backgroundColor: "rgba(99,102,241,0.9)",
                        borderColor: "rgba(99,102,241,1)",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: "#fff" } } },
                    scales: { y: { beginAtZero: true, ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } } },
                  }}
                />
              )}
              {(scoredPolicies.length === 0 || allBeneficiaryTypes.length === 0) && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaUsers className="text-5xl text-gray-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 text-lg font-semibold mb-2">No beneficiary data available</p>
                    <p className="text-gray-500">Policies are loading or no beneficiary information found</p>
                  </div>
                </div>
              )}
            </div>

            {/* Coverage Index Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Social Segments Addressed</p>
                <p className="text-3xl font-bold text-cyan-400">{allBeneficiaryTypes.length}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Coverage Index</p>
                <p className="text-3xl font-bold text-purple-400">{Math.round((allBeneficiaryTypes.length / 14) * 100)}%</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Beneficiary Links</p>
                <p className="text-3xl font-bold text-green-400">{scoredPolicies.reduce((sum, p) => sum + (p.extractedBeneficiaries ? p.extractedBeneficiaries.length : 0), 0)}</p>
              </motion.div>
            </div>

            {/* Beneficiary Impact Ranking with Drill-down */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl overflow-x-auto">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaChartPie className="text-green-400" /> Beneficiary Group Impact Ranking
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Beneficiary Group</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Policies Served</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Average Impact Score</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Coverage %</th>
                    <th className="text-left px-4 py-3 text-cyan-400 font-bold">Top Contributing Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {allBeneficiaryTypes
                    .map((b) => {
                      const pols = scoredPolicies.filter((p) => Array.isArray(p.extractedBeneficiaries) && p.extractedBeneficiaries.includes(b));
                      const avgScore = pols.length > 0 ? Math.round(pols.reduce((sum, p) => sum + p.impactScore.score, 0) / pols.length) : 0;
                      const topPolicy = pols.sort((a, b) => b.impactScore.score - a.impactScore.score)[0];
                      const coverage = Math.round((pols.length / scoredPolicies.length) * 100);
                      return { beneficiary: b, pols, avgScore, topPolicy, coverage };
                    })
                    .sort((a, b) => b.avgScore - a.avgScore)
                    .map((item) => (
                      <tr key={item.beneficiary} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                        <td className="px-4 py-3 text-white font-bold">{item.beneficiary}</td>
                        <td className="px-4 py-3 text-gray-300">{item.pols.length}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg">
                            {item.avgScore}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{item.coverage}%</td>
                        <td className="px-4 py-3 text-gray-400 text-sm truncate max-w-xs">{item.topPolicy?.title || "N/A"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Drill-down: Top Policies per Beneficiary */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaSearch className="text-orange-400" /> Top Policies by Beneficiary Group
              </h2>
              {allBeneficiaryTypes.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FaSearch className="text-5xl text-gray-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 text-lg font-semibold mb-2">No beneficiary groups found</p>
                    <p className="text-gray-500">No specific beneficiary groups could be identified in the current policies</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allBeneficiaryTypes.length > 0 && allBeneficiaryTypes.slice(0, 12).map((b) => {
                  const pols = scoredPolicies
                    .filter((p) => Array.isArray(p.extractedBeneficiaries) && p.extractedBeneficiaries.includes(b))
                    .sort((a, a2) => a2.impactScore.score - a.impactScore.score)
                    .slice(0, 3);

                  return (
                    <motion.div
                      key={b}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700/40 rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/50 transition-all"
                    >
                      <h3 className="text-lg font-bold text-cyan-400 mb-3">{b}</h3>
                      <div className="space-y-2">
                        {pols.map((p, idx) => (
                          <div key={p._id} className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold text-sm mt-1">#{idx + 1}</span>
                            <div>
                              <p className="text-white text-sm font-semibold truncate">{p.title}</p>
                              <p className="text-gray-400 text-xs">{p.ministry}</p>
                            </div>
                            <span className="ml-auto text-purple-400 font-bold text-sm flex-shrink-0">{p.impactScore.score}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: Visual Analytics */}
        {activeTab === "analytics" && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaSlidersH className="text-cyan-400" /> Advanced Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Sector</label>
                  <select
                    value={analyticsSector}
                    onChange={(e) => setAnalyticsSector(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Year</label>
                  <select
                    value={analyticsYear}
                    onChange={(e) => setAnalyticsYear(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Budget Min (₹)</label>
                  <input
                    type="number"
                    value={analyticsBudgetRange[0]}
                    onChange={(e) => setAnalyticsBudgetRange([Number(e.target.value), analyticsBudgetRange[1]])}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Budget Max (₹)</label>
                  <input
                    type="number"
                    value={analyticsBudgetRange[1]}
                    onChange={(e) => setAnalyticsBudgetRange([analyticsBudgetRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 bg-gray-800/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Visualization Selector */}
            <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-4">Select Visualization</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: "growth-timeline", label: "Policy Growth Timeline", icon: FaChartLine },
                  { id: "sector-trends", label: "Sector Investment Trends", icon: FaChartBar },
                  { id: "beneficiary-reach", label: "Beneficiary Reach", icon: FaUsers },
                  { id: "ministry-distribution", label: "Ministry Distribution", icon: FaBuilding },
                  { id: "impact-heatmap", label: "Impact Heatmap", icon: FaFire },
                ].map((viz) => (
                  <motion.button
                    key={viz.id}
                    onClick={() => setAnalyticsChartType(viz.id)}
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-3 rounded-lg font-bold transition-all text-sm flex items-center gap-2 ${
                      analyticsChartType === viz.id
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "bg-gray-800/50 text-gray-300 border border-purple-500/20 hover:border-purple-400/50"
                    }`}
                  >
                    <viz.icon /> {viz.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl h-96"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {analyticsChartType === "growth-timeline" && (
                    <>
                      <FaChartLine /> Policy Introduction Timeline
                    </>
                  )}
                  {analyticsChartType === "sector-trends" && (
                    <>
                      <FaChartBar /> Sector-wise Investment Trends
                    </>
                  )}
                  {analyticsChartType === "beneficiary-reach" && (
                    <>
                      <FaUsers /> Beneficiary Reach Distribution
                    </>
                  )}
                  {analyticsChartType === "ministry-distribution" && (
                    <>
                      <FaBuilding /> Ministry-wise Policy Distribution
                    </>
                  )}
                  {analyticsChartType === "impact-heatmap" && (
                    <>
                      <FaFire /> Impact Score Distribution
                    </>
                  )}
                </h3>
                {analyticsFilteredPolicies.length > 0 && (
                  <>
                    {analyticsChartType === "growth-timeline" && (
                      <Line
                        data={{
                          labels: years,
                          datasets: [
                            {
                              label: "Policies Introduced",
                              data: years.map(
                                (y) => analyticsFilteredPolicies.filter((p) => new Date(p.issueDate).getFullYear() === y).length
                              ),
                              borderColor: "rgba(99,102,241,1)",
                              backgroundColor: "rgba(99,102,241,0.1)",
                              borderWidth: 2,
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { labels: { color: "#fff" } } },
                          scales: { y: { beginAtZero: true, ticks: { color: "#fff" } } },
                        }}
                      />
                    )}
                    {analyticsChartType === "sector-trends" && (
                      <Bar
                        data={{
                          labels: sectors,
                          datasets: [
                            {
                              label: "Average Budget (₹ Cr)",
                              data: sectors.map((s) => {
                                const sectorPols = analyticsFilteredPolicies.filter((p) => p.sector === s);
                                const avgBudget = sectorPols.reduce(
                                  (sum, p) => sum + (Number(String(p.budget).replace(/[^0-9.-]+/g, "")) || 0),
                                  0
                                ) / sectorPols.length / 10000000;
                                return Math.round(avgBudget * 100) / 100;
                              }),
                              backgroundColor: "rgba(99,102,241,0.9)",
                              borderColor: "rgba(99,102,241,1)",
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { labels: { color: "#fff" } } },
                          scales: { y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.1)" } } },
                        }}
                      />
                    )}
                    {analyticsChartType === "beneficiary-reach" && (
                      <Bar
                        data={{
                          labels: allBeneficiaryTypes,
                          datasets: [
                            {
                              label: "Policies Serving",
                              data: allBeneficiaryTypes.map(
                                (b) => analyticsFilteredPolicies.filter((p) => Array.isArray(p.extractedBeneficiaries) && p.extractedBeneficiaries.includes(b)).length
                              ),
                              backgroundColor: ["#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#14B8A6"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { labels: { color: "#fff" } } },
                          scales: { y: { beginAtZero: true, ticks: { color: "#fff" } } },
                        }}
                      />
                    )}
                    {analyticsChartType === "ministry-distribution" && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                        {analyticsFilteredPolicies.length > 0 && ministries.slice(0, 8).some((m) => analyticsFilteredPolicies.filter((p) => p.ministry === m).length > 0) ? (
                          <div style={{ width: "90%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Doughnut
                              data={{
                                labels: ministries.slice(0, 8),
                                datasets: [
                                  {
                                    data: ministries.slice(0, 8).map((m) => analyticsFilteredPolicies.filter((p) => p.ministry === m).length),
                                    backgroundColor: ["#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#14B8A6"],
                                  },
                                ],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { 
                                  legend: { 
                                    labels: { color: "#fff", padding: 15, font: { size: 11 } }, 
                                    position: "bottom"
                                  } 
                                },
                              }}
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <FaBuilding className="text-5xl text-gray-500 mx-auto mb-4 opacity-50" />
                            <p className="text-gray-400 text-lg font-semibold mb-2">No ministry distribution data</p>
                            <p className="text-gray-500">No ministries found for the selected filters. Try adjusting your filter criteria.</p>
                          </div>
                        )}
                      </div>
                    )}
                    {analyticsChartType === "impact-heatmap" && (
                      <Bar
                        data={{
                          labels: ["0-20", "20-40", "40-60", "60-80", "80-100"],
                          datasets: [
                            {
                              label: "Policy Count",
                              data: [
                                analyticsFilteredPolicies.filter((p) => p.impactScore.score < 20).length,
                                analyticsFilteredPolicies.filter((p) => p.impactScore.score >= 20 && p.impactScore.score < 40).length,
                                analyticsFilteredPolicies.filter((p) => p.impactScore.score >= 40 && p.impactScore.score < 60).length,
                                analyticsFilteredPolicies.filter((p) => p.impactScore.score >= 60 && p.impactScore.score < 80).length,
                                analyticsFilteredPolicies.filter((p) => p.impactScore.score >= 80).length,
                              ],
                              backgroundColor: ["#EF4444", "#F59E0B", "#FBBF24", "#A3E635", "#10B981"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { labels: { color: "#fff" } } },
                          scales: { y: { beginAtZero: true, ticks: { color: "#fff" } } },
                        }}
                      />
                    )}
                  </>
                )}
                {analyticsFilteredPolicies.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaFilter className="text-5xl text-gray-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400 text-lg font-semibold mb-2">No policies match your filters</p>
                      <p className="text-gray-500">Try adjusting the sector, year, or budget range filters</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartBar className="text-cyan-400" />
                  <p className="text-gray-400 text-sm">Total Policies</p>
                </div>
                <p className="text-3xl font-bold text-cyan-400">{analyticsFilteredPolicies.length}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaTrophy className="text-purple-400" />
                  <p className="text-gray-400 text-sm">Average Impact Score</p>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {analyticsFilteredPolicies.length ? Math.round(analyticsFilteredPolicies.reduce((sum, p) => sum + p.impactScore.score, 0) / analyticsFilteredPolicies.length) : 0}
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaIndustry className="text-green-400" />
                  <p className="text-gray-400 text-sm">Sectors Covered</p>
                </div>
                <p className="text-3xl font-bold text-green-400">{sectors.length}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-l-4 border-orange-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaMoneyBill className="text-orange-400" />
                  <p className="text-gray-400 text-sm">Last Updated</p>
                </div>
                <p className="text-sm font-bold text-orange-400">{formattedLastUpdated}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImpactScoreCard;
