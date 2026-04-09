import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaSearch,
  FaCheck,
  FaTimes,
  FaLightbulb,
  FaEquals,
  FaChartLine,
  FaSync,
  FaFileAlt,
  FaCalendarAlt,
  FaGavel,
  FaClipboardList,
  FaCog,
  FaRocket,
  FaBullseye,
  FaExclamationTriangle,
  FaStar,
  FaListCheck,
  FaUser,
  FaArrowsLeftRight,
  FaTimeline,
  FaLink,
  FaBalanceScale,
} from "react-icons/fa";
import { MdSwapHoriz, MdAnalytics, MdInsights } from "react-icons/md";

// Debounce hook
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(value), delay);
  }, [callback, delay]);
};

// Real-world Indian government policies data
const SAMPLE_POLICIES = [
  {
    id: 1,
    title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    category: "Skill Development",
    issueDate: new Date("2015-07-15"),
    status: "Active",
    summary: "A flagship scheme focused on providing skills training to enhance employability of working-age population.",
    content: "PMKVY aims to provide industry-relevant skill training to youth and professionals. It focuses on outcome-based skill development with job placements and recognition of prior learning.",
    objectives: [
      "Train 10 million youth by 2020 with skill development",
      "Ensure better livelihoods through employment",
      "Build industry-backed training infrastructure",
      "Recognition of Prior Learning (RPL) for informal workers",
      "Improve wage earnings through skilled jobs"
    ],
    benefits: [
      "Free skill training for candidates",
      "Industry certification upon completion",
      "Job placement assistance up to Rs. 8000",
      "Allowance for trainees during training period",
      "Overseas job opportunities"
    ],
    highlights: [
      "Over 1.2 crore youth trained",
      "70% placement rate across sectors",
      "Partnership with 15,000+ employers",
      "Training in 150+ job roles",
      "RPL certification for 5+ lakh workers"
    ],
    keyHighlights: [
      "Training in 400+ skills across 37 industrial sectors",
      "Free training completely removing financial barriers",
      "Monthly stipend reducing financial burden during training",
      "Industry-recognized Pradhan Mantri Kaushal Certificates (PMKC)",
      "Placement support through dedicated job placement teams",
      "Apprenticeship opportunities with additional wage support",
      "Portable and stackable certifications enabling skill progression",
      "NGO and CSR organization partnerships for reach"
    ],
    targetAudience: "Unemployed youth aged 15-45 years, school/college dropouts, workers in informal sector",
    budget: "Rs. 12,000 crore for 2016-2020",
    implementation: "Implemented through NSDC, state governments, and training partners. Training conducted at Pradhan Mantri Skill Development Centers (PMSDCs) and affiliated institutes.",
    amendments: [
      "2016: Extended to cover recognition of prior learning",
      "2018: Increased placement assistance amount",
      "2020: Adapted for COVID-19 safety protocols",
      "2021: Enhanced focus on rural skill development"
    ]
  },
  {
    id: 2,
    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    ministry: "Ministry of Labour and Employment",
    category: "Healthcare",
    issueDate: new Date("2018-09-23"),
    status: "Active",
    summary: "India's largest government-funded healthcare program providing health coverage to vulnerable populations.",
    content: "PM-JAY provides hospitalization coverage of Rs. 5 lakh per household per year for secondary and tertiary care. It covers nearly 50 crore beneficiaries across India.",
    objectives: [
      "Provide financial protection against health shocks from catastrophic health situations",
      "Reduce out-of-pocket expenses for health services",
      "Promote preventive health through Ayushman Bharat wellness centers",
      "Improve quality of healthcare delivery",
      "Ensure equitable and universal health coverage"
    ],
    benefits: [
      "Coverage of Rs. 5 lakh per household annually",
      "Coverage for 1,354 treatment packages",
      "No age limit or disease restrictions",
      "Pre and post-hospitalization coverage",
      "Wide network of 2.5+ lakh empaneled hospitals"
    ],
    highlights: [
      "50 crore beneficiaries enrolled",
      "Over 2.5 crore claims authorized",
      "1,354 treatment packages covered",
      "Cashless service at empaneled hospitals",
      "Zero premium for beneficiaries"
    ],
    keyHighlights: [
      "World's largest government health insurance scheme by beneficiary base",
      "500+ hospital partners across all states",
      "Covers secondary & tertiary care without age restrictions",
      "Comprehensive coverage of surgeries & treatments",
      "Pre/post-hospitalization coverage included",
      "Integrated with Ayushman Bharat wellness centers",
      "Simplified claim process with direct hospital billing",
      "Beneficiary assistance through call centers & on-ground support"
    ],
    targetAudience: "Below poverty line (BPL) families, landless laborers, SECC identified poor households",
    budget: "Rs. 6,400 crore per year",
    implementation: "Centrally sponsored scheme with state-level coordination. Benefits delivered through empaneled hospitals and health centers across the country.",
    amendments: [
      "2019: Extended coverage to economic upper middle class",
      "2019: Integrated with health and wellness centers",
      "2020: Added COVID-19 treatment in covered packages",
      "2021: Enhanced empanelment of private hospitals"
    ]
  },
  {
    id: 3,
    title: "Make in India Initiative",
    ministry: "Ministry of Commerce and Industry",
    category: "Industrial Development",
    issueDate: new Date("2014-09-25"),
    status: "Active",
    summary: "A flagship initiative to encourage manufacturing and attract foreign direct investment in India.",
    content: "Make in India aims to transform India into a global manufacturing hub through structural reforms, simplified processes, and targeted investments in key sectors.",
    objectives: [
      "Attract foreign investment in manufacturing",
      "Boost domestic manufacturing capacity",
      "Create 100 million new jobs in manufacturing",
      "Increase manufacturing share in GDP to 16%",
      "Build world-class infrastructure for manufacturing"
    ],
    benefits: [
      "Simplified business registration and approval processes",
      "FDI policy relaxations in key sectors",
      "Infrastructure development under National Infrastructure Pipeline",
      "Tax incentives and exemptions for export units",
      "Ease of doing business reforms"
    ],
    highlights: [
      "FDI inflows increased to $64 billion annually",
      "6 million direct jobs created",
      "Presence in 28 major economic sectors",
      "Global investment promotion through roadshows",
      "Improvement in Ease of Doing Business rankings"
    ],
    keyHighlights: [
      "Simplified single-window clearance for industrial projects",
      "FDI policy reforms attracting multinational corporations",
      "National Infrastructure Pipeline with Rs. 111 lakh crore investment",
      "Dedicated sector-specific bodies for policy coordination",
      "25+ sectors covered with targeted incentives",
      "State-level dedicated investment facilitation",
      "Export promotion zones with competitive advantages",
      "Technology & innovation hubs across metros"
    ],
    targetAudience: "Foreign investors, domestic entrepreneurs, manufacturing sector companies",
    budget: "Rs. 5,000+ crore under various supporting schemes",
    implementation: "Implemented through business facilitation cells, sector-specific bodies, and state-level high-powered committees.",
    amendments: [
      "2015: Expanded to include logistics sector",
      "2017: Enhanced focus on sustainability",
      "2020: Added digital and renewable energy sectors",
      "2021: Green manufacturing push added"
    ]
  },
  {
    id: 4,
    title: "PM Svanidhi Scheme (Street Vendors)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Self Employment",
    issueDate: new Date("2020-06-01"),
    status: "Active",
    summary: "A micro-credit scheme for street vendors to restart their livelihoods affected by COVID-19.",
    content: "PM Svanidhi aims to provide collateral-free loans up to Rs. 10,000 to street vendors to help them restart their businesses after pandemic disruptions.",
    objectives: [
      "Provide livelihood support to street vendors",
      "Facilitate collateral-free micro-credit",
      "Encourage digital payment adoption",
      "Improve living standards of informal workers",
      "Support post-COVID economic recovery"
    ],
    benefits: [
      "Collateral-free working capital loan of Rs. 10,000",
      "Interest subvention of 7% for on-time repayment",
      "Digital payment incentives up to Rs. 100",
      "2-year repayment period with moratorium",
      "Easy documentation requirements"
    ],
    highlights: [
      "27+ lakh street vendors registered",
      "Over Rs. 1,700 crore loans disbursed",
      "Zero collateral requirement",
      "High repayment rate above 98%",
      "25 lakh digital payments adopted"
    ],
    keyHighlights: [
      "Quick collateral-free working capital loan up to Rs 10,000",
      "Zero-interest subvention for timely repayment",
      "Digital payment incentives up to Rs 100 per transaction",
      "Flexible 24-month repayment period with initial moratorium",
      "Minimal documentation supporting street vendor livelihoods",
      "Integration with government financial inclusion schemes",
      "Direct bank partnerships ensuring hassle-free disbursement",
      "Inclusive design for informal economy participation"
    ],
    targetAudience: "Street vendors with valid identity, occupation, and address proof",
    budget: "Rs. 5,000 crore fund allocation",
    implementation: "Through designated banks, microfinance institutions, and non-banking financial companies identified by states.",
    amendments: [
      "2020: Reduced to Rs. 5,000 initial loan amount",
      "2021: Extended loan duration to 24 months",
      "2021: Simplified documentation process",
      "2022: Added digital payment incentives"
    ]
  }
];

const PolicyComparison = () => {
  const navigate = useNavigate();

  const [policy1, setPolicy1] = useState("");
  const [policy2, setPolicy2] = useState("");
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [selectedPolicy1, setSelectedPolicy1] = useState(null);
  const [selectedPolicy2, setSelectedPolicy2] = useState(null);
  const [loadingPolicy1, setLoadingPolicy1] = useState(false);
  const [loadingPolicy2, setLoadingPolicy2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Search suggestions with debounce
  const performSearch1 = useCallback(async (value) => {
    if (value.trim().length > 2) {
      try {
        // First search in sample policies
        const sampleMatches = SAMPLE_POLICIES.filter(p =>
          p.title.toLowerCase().includes(value.toLowerCase()) ||
          p.category.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        
        if (sampleMatches.length > 0) {
          setSuggestions1(sampleMatches);
          setShowSuggestions1(true);
        } else {
          // Fallback to API if no sample policies match
          try {
            const res = await axios.get(
              `http://localhost:5000/api/policies?q=${value}`
            );
            setSuggestions1(res.data.slice(0, 5));
            setShowSuggestions1(true);
          } catch (err) {
            setSuggestions1(SAMPLE_POLICIES.slice(0, 5));
            setShowSuggestions1(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSuggestions1(false);
    }
  }, []);

  const debouncedSearch1 = useDebounce(performSearch1, 300);

  const handleSearch1 = (value) => {
    setPolicy1(value);
    debouncedSearch1(value);
  };

  const performSearch2 = useCallback(async (value) => {
    if (value.trim().length > 2) {
      try {
        // First search in sample policies
        const sampleMatches = SAMPLE_POLICIES.filter(p =>
          p.title.toLowerCase().includes(value.toLowerCase()) ||
          p.category.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        
        if (sampleMatches.length > 0) {
          setSuggestions2(sampleMatches);
          setShowSuggestions2(true);
        } else {
          // Fallback to API if no sample policies match
          try {
            const res = await axios.get(
              `http://localhost:5000/api/policies?q=${value}`
            );
            setSuggestions2(res.data.slice(0, 5));
            setShowSuggestions2(true);
          } catch (err) {
            setSuggestions2(SAMPLE_POLICIES.slice(0, 5));
            setShowSuggestions2(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSuggestions2(false);
    }
  }, []);

  const debouncedSearch2 = useDebounce(performSearch2, 300);

  const handleSearch2 = (value) => {
    setPolicy2(value);
    debouncedSearch2(value);
  };

  const fetchPolicyDetails = useCallback(async (titleOrPolicy) => {
    if (!titleOrPolicy) return null;
    // If it's already an object (from SAMPLE_POLICIES), return it fully populated
    if (typeof titleOrPolicy === "object" && titleOrPolicy.title) {
      return {
        ...titleOrPolicy,
        ministry: titleOrPolicy.ministry || "Not Specified",
        category: titleOrPolicy.category || "General Policy",
        issueDate: titleOrPolicy.issueDate || new Date(),
        status: titleOrPolicy.status || "Active",
        summary: titleOrPolicy.summary || "",
        content: titleOrPolicy.content || "",
        objectives: titleOrPolicy.objectives || [],
        benefits: titleOrPolicy.benefits || [],
        targetAudience: titleOrPolicy.targetAudience || "",
        budget: titleOrPolicy.budget || "Not Specified",
        implementation: titleOrPolicy.implementation || "",
        highlights: titleOrPolicy.highlights || [],
        amendments: titleOrPolicy.amendments || [],
        approvalDate: titleOrPolicy.approvalDate || null,
        principalBill: titleOrPolicy.principalBill || "",
        keyHighlights: titleOrPolicy.keyHighlights || [],
        challenges: titleOrPolicy.challenges || [],
        futureProspects: titleOrPolicy.futureProspects || "",
        parliamentDiscussions: titleOrPolicy.parliamentDiscussions || "",
        debates: titleOrPolicy.debates || []
      };
    }

    const title = String(titleOrPolicy).trim();
    // Try local SAMPLE_POLICIES exact match first
    const local = SAMPLE_POLICIES.find(p => p.title.toLowerCase() === title.toLowerCase());
    if (local) {
      return {
        ...local,
        ministry: local.ministry || "Not Specified",
        category: local.category || "General Policy",
        issueDate: local.issueDate || new Date(),
        status: local.status || "Active",
        summary: local.summary || "",
        content: local.content || "",
        objectives: local.objectives || [],
        benefits: local.benefits || [],
        targetAudience: local.targetAudience || "",
        budget: local.budget || "Not Specified",
        implementation: local.implementation || "",
        highlights: local.highlights || [],
        amendments: local.amendments || [],
        approvalDate: local.approvalDate || null,
        principalBill: local.principalBill || "",
        keyHighlights: local.keyHighlights || [],
        challenges: local.challenges || [],
        futureProspects: local.futureProspects || "",
        parliamentDiscussions: local.parliamentDiscussions || "",
        debates: local.debates || []
      };
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/policies?q=${encodeURIComponent(title)}`);
      if (res?.data && res.data.length > 0) {
        const policy = res.data[0];
        return {
          ...policy,
          ministry: policy.ministry || "Not Specified",
          category: policy.category || "General Policy",
          issueDate: policy.issueDate || new Date(),
          status: policy.status || "Active",
          summary: policy.summary || "",
          content: policy.content || "",
          objectives: policy.objectives || [],
          benefits: policy.benefits || [],
          targetAudience: policy.targetAudience || "",
          budget: policy.budget || "Not Specified",
          implementation: policy.implementation || "",
          highlights: policy.highlights || [],
          amendments: policy.amendments || [],
          approvalDate: policy.approvalDate || null,
          principalBill: policy.principalBill || "",
          keyHighlights: policy.keyHighlights || [],
          challenges: policy.challenges || [],
          futureProspects: policy.futureProspects || "",
          parliamentDiscussions: policy.parliamentDiscussions || "",
          debates: policy.debates || []
        };
      }
    } catch (err) {
      console.warn('Policy details fetch failed for:', title, err);
    }

    // Fallback complete object with all required fields
    return {
      title: title,
      summary: "Unable to fetch complete details from database",
      content: "",
      objectives: [],
      benefits: [],
      category: "General Policy",
      ministry: "Not Specified",
      targetAudience: "",
      issueDate: new Date(),
      status: "Active",
      budget: "Not Specified",
      implementation: "",
      highlights: [],
      amendments: [],
      approvalDate: null,
      principalBill: "",
      keyHighlights: [],
      challenges: [],
      futureProspects: "",
      parliamentDiscussions: "",
      debates: []
    };
  }, []);

  const selectPolicy1 = useCallback(async (policy) => {
    const policyTitle = policy.title || policy;
    setPolicy1(policyTitle);
    setShowSuggestions1(false);
    setSuggestions1([]);
    setLoadingPolicy1(true);
    try {
      const details = await fetchPolicyDetails(policy);
      if (details && details.ministry) {
        setSelectedPolicy1(details);
      } else {
        console.warn('Policy details incomplete:', details);
        setSelectedPolicy1(details);
      }
    } catch (err) {
      console.error('Error fetching policy 1 details:', err);
      setSelectedPolicy1(await fetchPolicyDetails(policyTitle));
    } finally {
      setLoadingPolicy1(false);
    }
  }, [fetchPolicyDetails]);

  const selectPolicy2 = useCallback(async (policy) => {
    const policyTitle = policy.title || policy;
    setPolicy2(policyTitle);
    setShowSuggestions2(false);
    setSuggestions2([]);
    setLoadingPolicy2(true);
    try {
      const details = await fetchPolicyDetails(policy);
      if (details && details.ministry) {
        setSelectedPolicy2(details);
      } else {
        console.warn('Policy details incomplete:', details);
        setSelectedPolicy2(details);
      }
    } catch (err) {
      console.error('Error fetching policy 2 details:', err);
      setSelectedPolicy2(await fetchPolicyDetails(policyTitle));
    } finally {
      setLoadingPolicy2(false);
    }
  }, [fetchPolicyDetails]);

  // FULLY DYNAMIC: Generate unique insights for each policy comparison
  const generateAdvancedInsights = useCallback((p1, p2) => {
    const insights = {
      similarities: [],
      differences: [],
      timeline: [],
      relations: [],
      impactAnalysis: [],
      recommendations: [],
    };

    // Infer policy sector from title
    const inferPolicySector = (title) => {
      const sectorMap = {
        'skill|training|employment|job|kaushal|udyam': 'Employment & Skills',
        'health|medical|ayushman|arogya|hospital': 'Healthcare',
        'education|literacy|learning|student|school|girl': 'Education',
        'women|female|mahila|shakti': 'Women Empowerment',
        'agriculture|farm|crop|farmer|kisan': 'Agriculture',
        'rural|gramin|village': 'Rural Development',
        'housing|home|awas': 'Housing & Urban',
        'credit|loan|svanidhi|finance|bank': 'Financial Services',
        'digital|internet|connectivity|broadband': 'Digital Infrastructure',
        'business|enterprise|start-up|manufacturing|make': 'Business & Industry',
        'environment|green|pollution|climate|renewable': 'Environment',
        'social|welfare|pension|security': 'Social Security'
      };
      
      const titleLower = title.toLowerCase();
      for (const [keywords, sector] of Object.entries(sectorMap)) {
        if (new RegExp(keywords).test(titleLower)) {
          return sector;
        }
      }
      return null;
    };

    // Get sector for each policy
    const sector1 = p1.category === 'General Policy' ? inferPolicySector(p1.title) : p1.category;
    const sector2 = p2.category === 'General Policy' ? inferPolicySector(p2.title) : p2.category;

    // ===== SECTOR COMPARISON =====
    if (sector1 && sector2) {
      if (sector1 === sector2) {
        insights.similarities.push(
          `<strong>Same Sector Focus:</strong> Both are ${sector1} policies`
        );
        insights.relations.push(
          `<strong>Complementary Approach:</strong> ${p1.title} and ${p2.title} address different aspects within ${sector1}, creating layered coverage for beneficiaries`
        );
      } else {
        insights.differences.push(
          `<strong>Different Sectors:</strong> ${p1.title} targets ${sector1}, while ${p2.title} addresses ${sector2}`
        );
        
        // Only add cross-sector relations if they're logical
        const crossSectorMap = {
          'Education': ['Employment & Skills', 'Digital Infrastructure'],
          'Employment & Skills': ['Education', 'Financial Services'],
          'Healthcare': ['Women Empowerment', 'Social Security'],
          'Digital Infrastructure': ['Education', 'Business & Industry'],
          'Financial Services': ['Employment & Skills', 'Business & Industry', 'Agriculture'],
          'Agriculture': ['Financial Services', 'Rural Development'],
          'Rural Development': ['Agriculture', 'Digital Infrastructure'],
          'Women Empowerment': ['Healthcare', 'Education', 'Financial Services'],
          'Housing & Urban': ['Rural Development', 'Digital Infrastructure'],
          'Business & Industry': ['Financial Services', 'Digital Infrastructure', 'Employment & Skills'],
          'Social Security': ['Healthcare', 'Women Empowerment']
        };
        
        if (crossSectorMap[sector1] && crossSectorMap[sector1].includes(sector2)) {
          insights.relations.push(
            `<strong>Synergistic Potential:</strong> Beneficiaries of ${p1.title} can leverage benefits from ${p2.title}, creating multiplier effect in ${sector2}`
          );
        }
      }
    }

    // ===== OBJECTIVES COMPARISON - ALWAYS INCLUDE IF AVAILABLE =====
    const obj1Array = Array.isArray(p1.objectives) ? p1.objectives : [];
    const obj2Array = Array.isArray(p2.objectives) ? p2.objectives : [];
    
    if (obj1Array.length > 0 && obj2Array.length > 0) {
      const diff = Math.abs(obj1Array.length - obj2Array.length);
      
      // Check if objectives have common themes
      const obj1Text = obj1Array.join(' ').toLowerCase();
      const obj2Text = obj2Array.join(' ').toLowerCase();
      
      // Check for actual meaningful overlaps
      const commonThemes = {
        'development': ['develop', 'growth', 'enhance', 'strengthen'],
        'access': ['access', 'provide', 'deliver', 'ensure'],
        'quality': ['quality', 'improve', 'upgrade', 'better'],
        'employment': ['job', 'employment', 'income', 'livelihood', 'employment'],
        'training': ['train', 'skill', 'educate', 'learn', 'knowledge'],
        'coverage': ['coverage', 'reach', 'expand', 'scale', 'coverage'],
        'support': ['support', 'help', 'aid', 'benefit']
      };
      
      let sharedTheme = null;
      for (const [theme, keywords] of Object.entries(commonThemes)) {
        const p1Has = keywords.some(kw => obj1Text.includes(kw));
        const p2Has = keywords.some(kw => obj2Text.includes(kw));
        if (p1Has && p2Has) {
          sharedTheme = theme;
          break;
        }
      }
      
      if (sharedTheme) {
        insights.similarities.push(
          `<strong>Aligned Objectives:</strong> Both focus on ${sharedTheme} as a core goal (${p1.title}: ${obj1Array.length}, ${p2.title}: ${obj2Array.length})`
        );
        
        // Add meaningful relation for shared objective theme
        const relationContext = {
          'development': `demonstrate commitment to holistic development across ${sector1 === sector2 ? sector1 : 'multiple sectors'}`,
          'access': `prioritize equitable access and inclusivity for their target beneficiaries`,
          'quality': `emphasize quality improvement and service excellence as core drivers`,
          'employment': `focus on sustainable livelihood and income generation opportunities`,
          'training': `invest in human capital development through structured programs`,
          'coverage': `aim for broad reach and scale to maximize population benefit`,
          'support': `are designed with comprehensive support mechanisms for implementation`
        };
        
        if (relationContext[sharedTheme]) {
          insights.relations.push(
            `<strong>Aligned Mission:</strong> Both ${p1.title} and ${p2.title} ${relationContext[sharedTheme]}`
          );
        }
      }
      
      if (diff >= 1) {
        const more = obj1Array.length > obj2Array.length ? p1 : p2;
        const fewer = obj1Array.length > obj2Array.length ? p2 : p1;
        insights.differences.push(
          `<strong>Scope Difference:</strong> ${more.title} has ${more.objectives.length} objectives, while ${fewer.title} has ${fewer.objectives.length}`
        );
      }
    } else if (obj1Array.length > 0 || obj2Array.length > 0) {
      const withObjs = obj1Array.length > 0 ? p1 : p2;
      const withoutObjs = obj1Array.length > 0 ? p2 : p1;
      const numObjs = obj1Array.length > obj2Array.length ? obj1Array.length : obj2Array.length;
      insights.differences.push(
        `<strong>Objectives Documentation:</strong> ${withObjs.title} has ${numObjs} documented objectives, ${withoutObjs.title} has no specific objectives listed`
      );
    } else {
      insights.impactAnalysis.push(
        `<strong>Note:</strong> Neither policy has specific objectives documented in the database`
      );
    }

    // ===== BENEFITS ANALYSIS - ALWAYS INCLUDE IF AVAILABLE =====
    const ben1Array = Array.isArray(p1.benefits) ? p1.benefits : [];
    const ben2Array = Array.isArray(p2.benefits) ? p2.benefits : [];
    
    if (ben1Array.length > 0 && ben2Array.length > 0) {
      const numBenefits1 = ben1Array.length;
      const numBenefits2 = ben2Array.length;
      
      const p1BenStr = ben1Array.join(' ').toLowerCase();
      const p2BenStr = ben2Array.join(' ').toLowerCase();
      
      // Check for financial benefits
      const hasFinancialP1 = /\brs\b|\brupees\b|\bamount\b|\bfund\b|\bgrant\b|\bsubsidy\b/.test(p1BenStr);
      const hasFinancialP2 = /\brs\b|\brupees\b|\bamount\b|\bfund\b|\bgrant\b|\bsubsidy\b/.test(p2BenStr);
      
      // Check for training/certification
      const hasTrainingP1 = /\bcertif|train|course|skill\b/.test(p1BenStr);
      const hasTrainingP2 = /\bcertif|train|course|skill\b/.test(p2BenStr);
      
      // Check for health/care
      const hasHealthP1 = /\bhealth|medical|hospital|treatment\b/.test(p1BenStr);
      const hasHealthP2 = /\bhealth|medical|hospital|treatment\b/.test(p2BenStr);
      
      // Show meaningful overlap
      if (hasFinancialP1 && hasFinancialP2) {
        insights.similarities.push(
          `<strong>Shared Benefit Type:</strong> Both provide financial assistance/support to beneficiaries`
        );
      } else if (hasTrainingP1 && hasTrainingP2) {
        insights.similarities.push(
          `<strong>Shared Benefit Type:</strong> Both offer training and skill certification`
        );
      } else if (hasHealthP1 && hasHealthP2) {
        insights.similarities.push(
          `<strong>Shared Benefit Type:</strong> Both focus on health and medical benefits`
        );
      } else if ((hasFinancialP1 || hasTrainingP1 || hasHealthP1) && (hasFinancialP2 || hasTrainingP2 || hasHealthP2)) {
        const p1Benefits = [];
        if (hasFinancialP1) p1Benefits.push('financial support');
        if (hasTrainingP1) p1Benefits.push('training');
        if (hasHealthP1) p1Benefits.push('healthcare');
        const p2Benefits = [];
        if (hasFinancialP2) p2Benefits.push('financial support');
        if (hasTrainingP2) p2Benefits.push('training');
        if (hasHealthP2) p2Benefits.push('healthcare');
        
        insights.differences.push(
          `<strong>Benefit Types Differ:</strong> ${p1.title} provides ${p1Benefits.join(', ')}, while ${p2.title} provides ${p2Benefits.join(', ')}`
        );
      }
      
      const diff = Math.abs(numBenefits1 - numBenefits2);
      if (diff >= 1) {
        const more = numBenefits1 > numBenefits2 ? p1 : p2;
        const fewer = numBenefits1 > numBenefits2 ? p2 : p1;
        insights.differences.push(
          `<strong>Benefit Coverage Range:</strong> ${more.title} provides ${more.benefits.length} benefits, while ${fewer.title} provides ${fewer.benefits.length}`
        );
      }
    } else if (ben1Array.length > 0 || ben2Array.length > 0) {
      const hasB = ben1Array.length > 0 ? p1 : p2;
      const noB = ben1Array.length > 0 ? p2 : p1;
      const benCount = ben1Array.length > ben2Array.length ? ben1Array.length : ben2Array.length;
      insights.differences.push(
        `<strong>Benefit Documentation:</strong> ${hasB.title} has ${benCount} documented benefits, while ${noB.title} has no specific benefits listed`
      );
    } else {
      insights.impactAnalysis.push(
        `<strong>Note:</strong> Neither policy has specific benefits documented in the database`
      );
    }

    // ===== IMPLEMENTATION ANALYSIS =====
    const impl1 = p1.implementation ? p1.implementation.toLowerCase() : "";
    const impl2 = p2.implementation ? p2.implementation.toLowerCase() : "";
    
    if (impl1.length > 5 && impl2.length > 5) {
      const channels = ['state', 'district', 'central', 'bank', 'ngo', 'private', 'ministry', 'agency', 'college', 'school', 'institute'];
      const p1Channels = channels.filter(c => impl1.includes(c));
      const p2Channels = channels.filter(c => impl2.includes(c));
      const commonChannels = p1Channels.filter(c => p2Channels.includes(c));
      
      if (commonChannels.length > 0) {
        insights.similarities.push(
          `<strong>Similar Delivery Channels:</strong> Both use ${commonChannels.join(', ')} for implementation`
        );
      } else if (p1Channels.length > 0 && p2Channels.length > 0) {
        insights.differences.push(
          `<strong>Different Implementation Models:</strong> ${p1.title} uses ${p1Channels.join(', ')}, while ${p2.title} uses ${p2Channels.join(', ')}`
        );
      }
    } else if (impl1.length > 5 || impl2.length > 5) {
      const hasImpl = impl1.length > 5 ? p1 : p2;
      insights.differences.push(
        `<strong>Implementation Documentation:</strong> ${hasImpl.title} has detailed implementation strategy, other policy lacks documentation`
      );
    }

    // ===== AMENDMENTS & MATURITY =====
    const amend1Array = Array.isArray(p1.amendments) ? p1.amendments : [];
    const amend2Array = Array.isArray(p2.amendments) ? p2.amendments : [];
    
    if (amend1Array.length > 0 && amend2Array.length > 0) {
      const diff = Math.abs(amend1Array.length - amend2Array.length);
      if (amend1Array.length === amend2Array.length) {
        insights.similarities.push(
          `<strong>Similar Policy Maturity:</strong> Both have ${amend1Array.length} documented amendments/updates`
        );
      } else if (diff >= 1) {
        const more = amend1Array.length > amend2Array.length ? p1 : p2;
        const fewer = amend1Array.length > amend2Array.length ? p2 : p1;
        insights.differences.push(
          `<strong>Policy Evolution Track Record:</strong> ${more.title} has ${more.amendments.length} amendments, while ${fewer.title} has ${fewer.amendments.length}`
        );
      }
    } else if (amend1Array.length > 0 || amend2Array.length > 0) {
      const withAmend = amend1Array.length > 0 ? p1 : p2;
      const withoutAmend = amend1Array.length > 0 ? p2 : p1;
      const amendCount = amend1Array.length > amend2Array.length ? amend1Array.length : amend2Array.length;
      insights.differences.push(
        `<strong>Amendment History:</strong> ${withAmend.title} has ${amendCount} documented amendments, while ${withoutAmend.title} has no amendments recorded`
      );
    } else {
      insights.impactAnalysis.push(
        `<strong>Note:</strong> Neither policy has amendment history documented`
      );
    }

    // ===== MINISTRY & GOVERNANCE =====
    if (p1.ministry && p2.ministry && p1.ministry.length > 3 && p2.ministry.length > 3) {
      if (p1.ministry === p2.ministry) {
        insights.similarities.push(
          `<strong>Single Authority:</strong> Both managed by ${p1.ministry}`
        );
      } else {
        // Clean ministry names for better display
        const cleanMin1 = p1.ministry.replace(/^Ministry of\s*/i, '').trim();
        const cleanMin2 = p2.ministry.replace(/^Ministry of\s*/i, '').trim();
        
        // Only show if ministry names are substantially different (not just partial)
        if (cleanMin1 && cleanMin2 && cleanMin1 !== cleanMin2) {
          insights.differences.push(
            `<strong>Different Oversight:</strong> ${p1.title} overseen by ${cleanMin1}, while ${p2.title} managed by ${cleanMin2}`
          );
        }
      }
    }

    // ===== TIMELINE & EVOLUTION =====
    let date1, date2;
    try {
      date1 = p1.issueDate ? new Date(p1.issueDate) : null;
      date2 = p2.issueDate ? new Date(p2.issueDate) : null;
      
      if (date1 && date2 && !isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
        if (date1.getTime() !== date2.getTime()) {
          const yearGap = Math.abs(date2.getFullYear() - date1.getFullYear());
          const monthGap = Math.abs(date2.getMonth() - date1.getMonth());
          
          if (yearGap > 3 || (yearGap === 3 && monthGap > 0)) {
            if (date1 < date2) {
              insights.timeline.push(
                `<strong>Clear Succession:</strong> ${p2.title} was launched ${yearGap} year${yearGap > 1 ? 's' : ''} after ${p1.title}`
              );
              if (sector1 === sector2) {
                insights.timeline.push(
                  `<strong>Policy Evolution:</strong> ${p2.title} likely evolved from or refined the ${sector1} approach`
                );
              }
            } else {
              insights.timeline.push(
                `<strong>Predecessor Policy:</strong> ${p1.title} predates ${p2.title} by ${yearGap} year${yearGap > 1 ? 's' : ''}`
              );
            }
          } else if (yearGap > 0 || monthGap > 0) {
            const timeGap = yearGap > 0 ? `${yearGap} year${yearGap > 1 ? 's' : ''}` : `${monthGap} month${monthGap > 1 ? 's' : ''}`;
            insights.timeline.push(
              `<strong>Sequential Launches:</strong> Policies were launched ${timeGap} apart`
            );
            
            if (monthGap === 0 && yearGap === 0) {
              insights.relations.push(
                `<strong>Coordinated Launch Strategy:</strong> ${p1.title} and ${p2.title} were launched simultaneously, suggesting a deliberate integrated policy framework for comprehensive coverage`
              );
            } else {
              // Add strategic sequencing insight
              const temporal = date1 < date2 ? `${p1.title} was launched first, followed by ${p2.title}` : `${p2.title} preceded ${p1.title}`;
              insights.relations.push(
                `<strong>Strategic Sequencing:</strong> ${temporal}, suggesting phased implementation of complementary initiatives`
              );
            }
          } else {
            insights.timeline.push(
              `<strong>Concurrent Launch:</strong> Both policies were launched in the same period`
            );
          }
        }
      } else {
        insights.timeline.push(
          `<strong>Timeline Data:</strong> ${p1.title} issued on ${formatDate(p1.issueDate)}, ${p2.title} issued on ${formatDate(p2.issueDate)}`
        );
      }
    } catch (e) {
      insights.timeline.push(
        `<strong>Timeline Data:</strong> ${p1.title} issued on ${formatDate(p1.issueDate)}, ${p2.title} issued on ${formatDate(p2.issueDate)}`
      );
    }

    // ===== AUDIENCE ANALYSIS =====
    const aud1 = p1.targetAudience ? p1.targetAudience.toLowerCase() : "";
    const aud2 = p2.targetAudience ? p2.targetAudience.toLowerCase() : "";
    
    if (aud1.length > 3 && aud2.length > 3) {
      if (aud1 === aud2) {
        insights.similarities.push(
          `<strong>Same Target Beneficiaries:</strong> Both policies serve: ${p1.targetAudience}`
        );
      } else {
        const audienceTypes = ['youth', 'women', 'farmer', 'rural', 'poor', 'worker', 'unemployed', 'family', 'student', 'senior', 'disabled', 'elderly', 'children', 'households'];
        const p1Aud = audienceTypes.filter(a => aud1.includes(a));
        const p2Aud = audienceTypes.filter(a => aud2.includes(a));
        const overlap = p1Aud.filter(a => p2Aud.includes(a));
        
        if (overlap.length > 0) {
          insights.similarities.push(
            `<strong>Overlapping Beneficiaries:</strong> Both serve ${overlap.join(', ')} populations`
          );
          
          // Add meaningful relation for overlapping audiences
          insights.relations.push(
            `<strong>Integrated Beneficiary Support:</strong> Common beneficiaries of ${overlap.join(' and ')} can simultaneously benefit from ${p1.title} and ${p2.title}, creating comprehensive support ecosystem`
          );
        } else if (p1Aud.length > 0 && p2Aud.length > 0) {
          insights.differences.push(
            `<strong>Different Target Groups:</strong> ${p1.title} targets ${p1Aud.join(', ')}, while ${p2.title} targets ${p2Aud.join(', ')}`
          );
        }
      }
    } else if (aud1.length > 3 || aud2.length > 3) {
      const hasAud = aud1.length > 3 ? p1 : p2;
      insights.impactAnalysis.push(
        `<strong>${hasAud.title} Target Audience:</strong> ${hasAud.targetAudience}`
      );
    }

    // ===== BUDGET SCALE =====
    const bud1 = p1.budget ? p1.budget.trim() : "";
    const bud2 = p2.budget ? p2.budget.trim() : "";
    
    if (bud1.length > 3 && bud2.length > 3) {
      if (bud1.toLowerCase() === bud2.toLowerCase()) {
        insights.similarities.push(
          `<strong>Same Budget Allocation:</strong> Both policies have budget: ${p1.budget}`
        );
      } else {
        insights.impactAnalysis.push(
          `<strong>Budget Comparison:</strong> ${p1.title}: ${p1.budget} | ${p2.title}: ${p2.budget}`
        );
      }
    } else if (bud1.length > 3 || bud2.length > 3) {
      const hasBudget = bud1.length > 3 ? p1 : p2;
      insights.impactAnalysis.push(
        `<strong>Budget Information:</strong> ${hasBudget.title} has budget of ${hasBudget.budget}`
      );
    }

    // ===== HIGHLIGHTS & ACHIEVEMENTS =====
    const high1Array = Array.isArray(p1.highlights) || Array.isArray(p1.keyHighlights) ? 
      (p1.highlights || p1.keyHighlights || []) : [];
    const high2Array = Array.isArray(p2.highlights) || Array.isArray(p2.keyHighlights) ? 
      (p2.highlights || p2.keyHighlights || []) : [];
    
    if (high1Array.length > 0 || high2Array.length > 0) {
      const h1 = high1Array.length || 0;
      const h2 = high2Array.length || 0;
      if (h1 > 0 && h2 > 0) {
        insights.relations.push(
          `<strong>Proven Success Track Record:</strong> Both policies demonstrate measurable impact - ${p1.title} with ${h1} key achievements and ${p2.title} with ${h2}, indicating sustained progress and effectiveness`
        );
      } else if (h1 > 0 || h2 > 0) {
        const withHighlights = h1 > 0 ? p1 : p2;
        const highlightCount = h1 > h2 ? h1 : h2;
        insights.differences.push(
          `<strong>Result Documentation:</strong> ${withHighlights.title} has ${highlightCount} documented achievements`
        );
      }
    }

    // ===== CHALLENGES & FUTURE PROSPECTS =====
    const challenges1 = Array.isArray(p1.challenges) ? p1.challenges : [];
    const challenges2 = Array.isArray(p2.challenges) ? p2.challenges : [];
    const future1 = p1.futureProspects ? p1.futureProspects.toLowerCase() : "";
    const future2 = p2.futureProspects ? p2.futureProspects.toLowerCase() : "";
    
    if ((challenges1.length > 0 || challenges2.length > 0) && sector1 === sector2) {
      insights.relations.push(
        `<strong>Shared Challenge Mitigation:</strong> Both policies identify similar implementation challenges, indicating industry-wide concerns that coordinated action could address more effectively`
      );
    }
    
    if (future1.length > 10 && future2.length > 10) {
      // Check for common future goals
      const futureKeywords = ['expand', 'scale', 'improve', 'strengthen', 'enhance', 'acceleration', 'integration', 'digital'];
      const p1FutureGoals = futureKeywords.filter(kw => future1.includes(kw)).length;
      const p2FutureGoals = futureKeywords.filter(kw => future2.includes(kw)).length;
      
      if (p1FutureGoals > 0 && p2FutureGoals > 0) {
        insights.relations.push(
          `<strong>Aligned Future Vision:</strong> Both policies articulate ambitions for growth and improvement, creating opportunity for coordinated strategic advancement and joint implementation planning`
        );
      }
    }

    // ===== SMART RECOMMENDATIONS =====
    if (sector1 && sector2) {
      if (sector1 === sector2 && insights.similarities.length > 0) {
        const sharedMinistry = p1.ministry === p2.ministry;
        if (sharedMinistry) {
          insights.recommendations.push(
            `<strong>Consolidated Implementation:</strong> Since both ${p1.title} and ${p2.title} are managed by the same ministry, consolidate program administration and create unified grievance redressal mechanisms to improve operational efficiency`
          );
        } else {
          insights.recommendations.push(
            `<strong>Inter-Ministry Coordination:</strong> Establish joint steering committees between overseeing ministries to harmonize implementation timelines, eliminate duplication, and create synergistic beneficiary pathways`
          );
        }
      } else if (sector1 !== sector2) {
        insights.recommendations.push(
          `<strong>Cross-Sector Beneficiary Strategy:</strong> Create policies that enable beneficiaries of ${p1.title} in ${sector1} to access relevant benefits from ${p2.title} in ${sector2}, maximizing social impact per rupee invested`
        );
      }
    }
    
    // Add recommendations based on available data
    if (insights.relations.length === 0) {
      insights.recommendations.push(
        `<strong>Enhanced Policy Linkage Required:</strong> Establish explicit connections between ${p1.title} and ${p2.title} through updated policy documents, inter-agency MOUs, or revised implementation guidelines to unlock synergies`
      );
    }
    
    if (insights.similarities.length < 2 && insights.differences.length < 2) {
      insights.recommendations.push(
        `<strong>Policy Data Enhancement:</strong> Complete missing policy attributes (objectives, benefits, amendments, future prospects) in the database to enable comprehensive comparative analysis and better identify relationships`
      );
    }
    
    return insights;
  }, []);

  const handleCompare = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let policy1ToCompare = selectedPolicy1;
      let policy2ToCompare = selectedPolicy2;

      // If policy not selected but text is typed, fetch from API
      if (!policy1ToCompare && policy1.trim().length > 0) {
        policy1ToCompare = await fetchPolicyDetails(policy1.trim());
      }

      if (!policy2ToCompare && policy2.trim().length > 0) {
        policy2ToCompare = await fetchPolicyDetails(policy2.trim());
      }

      if (!policy1ToCompare || !policy2ToCompare) {
        setError("Please select or search for both policies to compare");
        setLoading(false);
        return;
      }

      // Ensure both policies have all required attributes filled
      const ensureCompletePolicy = (policy) => ({
        ...policy,
        ministry: policy.ministry || "Not Specified",
        category: policy.category || "General Policy",
        issueDate: policy.issueDate || new Date(),
        status: policy.status || "Active",
        summary: policy.summary || "",
        content: policy.content || "",
        objectives: Array.isArray(policy.objectives) ? policy.objectives : [],
        benefits: Array.isArray(policy.benefits) ? policy.benefits : [],
        targetAudience: policy.targetAudience || "",
        budget: policy.budget || "Not Specified",
        implementation: policy.implementation || "",
        highlights: Array.isArray(policy.highlights) ? policy.highlights : [],
        amendments: Array.isArray(policy.amendments) ? policy.amendments : [],
        approvalDate: policy.approvalDate || null,
        principalBill: policy.principalBill || "",
        keyHighlights: Array.isArray(policy.keyHighlights) ? policy.keyHighlights : [],
        challenges: Array.isArray(policy.challenges) ? policy.challenges : [],
        futureProspects: policy.futureProspects || "",
        parliamentDiscussions: policy.parliamentDiscussions || "",
        debates: Array.isArray(policy.debates) ? policy.debates : []
      });

      const comparison1 = ensureCompletePolicy(policy1ToCompare);
      const comparison2 = ensureCompletePolicy(policy2ToCompare);

      // Debug logging
      console.log('=== COMPARISON DATA DEBUG ===');
      console.log('Policy 1:', comparison1.title);
      console.log('Policy 1 keyHighlights:', comparison1.keyHighlights);
      console.log('Policy 1 keyHighlights type:', typeof comparison1.keyHighlights);
      console.log('Policy 1 keyHighlights is array:', Array.isArray(comparison1.keyHighlights));
      console.log('Policy 1 keyHighlights length:', comparison1.keyHighlights?.length);
      console.log('---');
      console.log('Policy 2:', comparison2.title);
      console.log('Policy 2 keyHighlights:', comparison2.keyHighlights);
      console.log('Policy 2 keyHighlights type:', typeof comparison2.keyHighlights);
      console.log('Policy 2 keyHighlights is array:', Array.isArray(comparison2.keyHighlights));
      console.log('Policy 2 keyHighlights length:', comparison2.keyHighlights?.length);

      // Generate insights dynamically based on actual policy data
      const insights = generateAdvancedInsights(comparison1, comparison2);

      setComparisonData({
        policy1: comparison1,
        policy2: comparison2,
        insights: insights,
      });
      setActiveTab("overview");
    } catch (err) {
      console.error(err);
      setError("Failed to compare policies: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedPolicy1, selectedPolicy2, policy1, policy2, generateAdvancedInsights, fetchPolicyDetails]);

  const swapPolicies = useCallback(() => {
    const temp1 = selectedPolicy1;
    const temp2 = selectedPolicy2;
    const tempStr1 = policy1;
    const tempStr2 = policy2;

    setSelectedPolicy1(temp2);
    setSelectedPolicy2(temp1);
    setPolicy1(tempStr2);
    setPolicy2(tempStr1);
  }, [selectedPolicy1, selectedPolicy2, policy1, policy2]);

  const formatDate = useCallback((date) => {
    if (!date) return "Not Specified";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "Invalid Date";
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() =>
            navigate("/dashboard", { state: { skipIntro: true } })
          }
          className="mb-8 flex items-center gap-2 text-white font-semibold hover:text-purple-300 transition-colors group"
        >
          <FaArrowLeft className="transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl md:text-5xl filter drop-shadow-md select-none"
            >
              ⚖️
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md leading-tight pb-2">
              Policy Comparison Engine
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Analyze <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">side-by-side differences</span> with AI-powered insights across legislative intent, timeline, and impact
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-25"></div>

          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-purple-400/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl group hover:border-purple-300/80 hover:shadow-purple-500/30 transition-all">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              {/* Policy 1 Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 relative"
              >
                <label className="block text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-cyan-400 text-xl" /> First Policy
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={policy1}
                    onChange={(e) => handleSearch1(e.target.value)}
                    onFocus={() => policy1.length > 2 && setShowSuggestions1(true)}
                    placeholder="Search policy name..."
                    className="w-full bg-gray-800/60 border-2 border-purple-500/40 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-500/60 transition-all text-lg font-medium"
                  />
                  <FaSearch className="absolute right-4 top-4 text-purple-400 text-lg" />

                  {/* Suggestions Dropdown 1 */}
                  {showSuggestions1 && suggestions1.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-purple-500/60 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto"
                    >
                      {suggestions1.map((policy) => (
                        <motion.button
                          key={policy._id}
                          onClick={() => selectPolicy1(policy)}
                          whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                          className="w-full text-left px-5 py-3 border-b border-gray-700 last:border-b-0 text-white hover:text-cyan-400 transition-colors"
                        >
                          <p className="font-semibold text-sm">{policy.title}</p>
                          <p className="text-xs text-gray-400">
                            {policy.category} • {policy.ministry}
                          </p>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {selectedPolicy1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-green-400 text-sm font-semibold flex items-center gap-2"
                  >
                    <FaCheck /> Selected
                  </motion.div>
                )}
              </motion.div>

              {/* Swap Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={swapPolicies}
                disabled={!selectedPolicy1 || !selectedPolicy2}
                className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center"
                title="Swap policies"
              >
                <MdSwapHoriz className="text-2xl" />
              </motion.button>

              {/* Policy 2 Input */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 relative"
              >
                <label className="block text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-pink-400 text-xl" /> Second Policy
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={policy2}
                    onChange={(e) => handleSearch2(e.target.value)}
                    onFocus={() => policy2.length > 2 && setShowSuggestions2(true)}
                    placeholder="Search policy name..."
                    className="w-full bg-gray-800/60 border-2 border-purple-500/40 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-500/60 transition-all text-lg font-medium"
                  />
                  <FaSearch className="absolute right-4 top-4 text-purple-400 text-lg" />

                  {/* Suggestions Dropdown 2 */}
                  {showSuggestions2 && suggestions2.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-purple-500/60 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto"
                    >
                      {suggestions2.map((policy) => (
                        <motion.button
                          key={policy._id}
                          onClick={() => selectPolicy2(policy)}
                          whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                          className="w-full text-left px-5 py-3 border-b border-gray-700 last:border-b-0 text-white hover:text-pink-400 transition-colors"
                        >
                          <p className="font-semibold text-sm">{policy.title}</p>
                          <p className="text-xs text-gray-400">
                            {policy.category} • {policy.ministry}
                          </p>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {selectedPolicy2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-green-400 text-sm font-semibold flex items-center gap-2"
                  >
                    <FaCheck /> Selected
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Compare Button */}
            <motion.button
              onClick={handleCompare}
              disabled={!selectedPolicy1 || !selectedPolicy2 || loading}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FaChartLine /> Compare Policies Now
                </>
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg p-4 text-red-300 font-semibold"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Comparison Results */}
        {comparisonData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Tab Navigation */}
            <div className="flex gap-2 flex-wrap justify-start bg-gray-900/60 p-4 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              {[
                { id: "overview", label: "Overview", icon: FaChartLine },
                { id: "detailed", label: "Detailed", icon: FaFileAlt },
                { id: "similarities", label: "Similarities", icon: FaEquals },
                { id: "differences", label: "Differences", icon: FaTimes },
                { id: "timeline", label: "Timeline", icon: FaCalendarAlt },
                { id: "relations", label: "Relations", icon: FaGavel },
                { id: "impact", label: "Impact", icon: MdAnalytics },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-800/60 text-gray-300 hover:text-white border border-purple-500/30 hover:border-purple-500/60"
                    }`}
                  >
                    <IconComponent className="text-lg" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Policy 1 Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-cyan-500/30 group-hover:border-cyan-400/60 rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 shadow-lg">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="bg-cyan-600/20 border border-cyan-500/50 rounded-lg p-2 flex-shrink-0">
                        <FaFileAlt className="text-cyan-400 text-lg" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-cyan-300 leading-tight">
                        {comparisonData.policy1.title}
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <FaClipboardList className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Ministry</p>
                          <p className="text-white font-semibold">{comparisonData.policy1.ministry}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaGavel className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Category</p>
                          <p className="text-white font-semibold">{comparisonData.policy1.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Issued</p>
                          <p className="text-white font-semibold">{formatDate(comparisonData.policy1.issueDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaCheck className="text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Status</p>
                          <p className="text-white font-semibold">{comparisonData.policy1.status || "Active"}</p>
                        </div>
                      </div>

                      {comparisonData.policy1.summary && (
                        <div className="pt-4 border-t border-cyan-500/20">
                          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Summary</p>
                          <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal">
                            {comparisonData.policy1.summary.substring(0, 500)}{comparisonData.policy1.summary.length > 500 ? "..." : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Policy 2 Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-pink-500/30 group-hover:border-pink-400/60 rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 shadow-lg">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="bg-pink-600/20 border border-pink-500/50 rounded-lg p-2 flex-shrink-0">
                        <FaFileAlt className="text-pink-400 text-lg" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-pink-300 leading-tight">
                        {comparisonData.policy2.title}
                      </h2>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <FaClipboardList className="text-pink-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Ministry</p>
                          <p className="text-white font-semibold">{comparisonData.policy2.ministry}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaGavel className="text-pink-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Category</p>
                          <p className="text-white font-semibold">{comparisonData.policy2.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-pink-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Issued</p>
                          <p className="text-white font-semibold">{formatDate(comparisonData.policy2.issueDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <FaCheck className="text-pink-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase">Status</p>
                          <p className="text-white font-semibold">{comparisonData.policy2.status || "Active"}</p>
                        </div>
                      </div>

                      {comparisonData.policy2.summary && (
                        <div className="pt-4 border-t border-pink-500/20">
                          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Summary</p>
                          <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal">
                            {comparisonData.policy2.summary.substring(0, 500)}{comparisonData.policy2.summary.length > 500 ? "..." : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Detailed Comparison Tab */}
            {activeTab === "detailed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Side-by-Side Attribute Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm"
                >
                  <h2 className="text-2xl font-bold text-purple-300 mb-8 flex items-center gap-3">
                    <FaFileAlt className="text-xl" /> Attribute Comparison
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Ministry */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Ministry</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-cyan-400 font-bold text-sm break-words whitespace-normal">{comparisonData.policy1.ministry}</p>
                        </div>
                        <div>
                          <p className="text-pink-400 font-bold text-sm break-words whitespace-normal">{comparisonData.policy2.ministry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Category</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-cyan-400 font-bold text-sm bg-cyan-500/10 px-3 py-2 rounded-lg inline-block break-words">{comparisonData.policy1.category}</p>
                        </div>
                        <div>
                          <p className="text-pink-400 font-bold text-sm bg-pink-500/10 px-3 py-2 rounded-lg inline-block break-words">{comparisonData.policy2.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Issue Date */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Issue Date</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-cyan-400 font-bold text-sm">{formatDate(comparisonData.policy1.issueDate)}</p>
                        </div>
                        <div>
                          <p className="text-pink-400 font-bold text-sm">{formatDate(comparisonData.policy2.issueDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Status</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-green-400 font-bold text-sm flex items-center gap-2">
                            <FaCheck className="text-xs" /> {comparisonData.policy1.status || "Active"}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-400 font-bold text-sm flex items-center gap-2">
                            <FaCheck className="text-xs" /> {comparisonData.policy2.status || "Active"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Budget Allocation</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-cyan-400 font-bold text-sm break-words whitespace-normal">{comparisonData.policy1.budget || "Not Specified"}</p>
                        </div>
                        <div>
                          <p className="text-pink-400 font-bold text-sm break-words whitespace-normal">{comparisonData.policy2.budget || "Not Specified"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-3">Target Audience</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-cyan-300 text-sm leading-relaxed break-words whitespace-normal">{comparisonData.policy1.targetAudience || "Not Specified"}</p>
                        </div>
                        <div>
                          <p className="text-pink-300 text-sm leading-relaxed break-words whitespace-normal">{comparisonData.policy2.targetAudience || "Not Specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Core Content Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Policy 1 Summary */}
                  <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                      <FaFileAlt className="text-lg" /> Summary
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal max-h-48 overflow-y-auto">
                      {comparisonData.policy1.summary || comparisonData.policy1.content?.substring(0, 500) || "No summary available"}
                    </p>
                  </div>

                  {/* Policy 2 Summary */}
                  <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-pink-300 mb-4 flex items-center gap-2">
                      <FaFileAlt className="text-lg" /> Summary
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal max-h-48 overflow-y-auto">
                      {comparisonData.policy2.summary || comparisonData.policy2.content?.substring(0, 500) || "No summary available"}
                    </p>
                  </div>
                </motion.div>

                {/* Objectives Comparison */}
                {(comparisonData.policy1.objectives || comparisonData.policy2.objectives) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Policy 1 Objectives */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2"><FaBullseye className="text-lg" /> Objectives</h3>
                      {comparisonData.policy1.objectives?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {comparisonData.policy1.objectives.map((obj, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-blue-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No objectives listed</p>
                      )}
                    </div>

                    {/* Policy 2 Objectives */}
                    <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-pink-300 mb-4 flex items-center gap-2"><FaBullseye className="text-lg" /> Objectives</h3>
                      {comparisonData.policy2.objectives?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {comparisonData.policy2.objectives.map((obj, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-pink-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No objectives listed</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Benefits Comparison */}
                {(comparisonData.policy1.benefits || comparisonData.policy2.benefits) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Policy 1 Benefits */}
                    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2"><FaStar className="text-lg" /> Key Benefits</h3>
                      {comparisonData.policy1.benefits?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {comparisonData.policy1.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-green-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No benefits listed</p>
                      )}
                    </div>

                    {/* Policy 2 Benefits */}
                    <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-teal-300 mb-4 flex items-center gap-2"><FaStar className="text-lg" /> Key Benefits</h3>
                      {comparisonData.policy2.benefits?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {comparisonData.policy2.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-teal-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No benefits listed</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Implementation Comparison */}
                {(comparisonData.policy1.implementation || comparisonData.policy2.implementation) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Policy 1 Implementation */}
                    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                        <FaCog className="text-lg" /> Implementation Strategy
                      </h3>
                      {comparisonData.policy1.implementation ? (
                        <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal">{comparisonData.policy1.implementation}</p>
                      ) : (
                        <p className="text-gray-400 text-sm">No implementation details available</p>
                      )}
                    </div>

                    {/* Policy 2 Implementation */}
                    <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                        <FaCog className="text-lg" /> Implementation Strategy
                      </h3>
                      {comparisonData.policy2.implementation ? (
                        <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-normal">{comparisonData.policy2.implementation}</p>
                      ) : (
                        <p className="text-gray-400 text-sm">No implementation details available</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Highlights/Key Points Comparison */}
                {(comparisonData.policy1.highlights || comparisonData.policy1.keyPoints || comparisonData.policy1.keyHighlights || comparisonData.policy2.highlights || comparisonData.policy2.keyPoints || comparisonData.policy2.keyHighlights) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Policy 1 Highlights */}
                    <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
                        <FaLightbulb className="text-lg" /> Key Highlights
                      </h3>
                      {(comparisonData.policy1.keyHighlights && comparisonData.policy1.keyHighlights.length > 0) || (comparisonData.policy1.highlights && comparisonData.policy1.highlights.length > 0) || (comparisonData.policy1.keyPoints && comparisonData.policy1.keyPoints.length > 0) ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {(comparisonData.policy1.keyHighlights || comparisonData.policy1.highlights || comparisonData.policy1.keyPoints || []).map((highlight, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-yellow-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No highlights available</p>
                      )}
                    </div>

                    {/* Policy 2 Highlights */}
                    <div className="bg-gradient-to-br from-lime-900/20 to-green-900/20 border border-lime-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-lime-300 mb-4 flex items-center gap-2">
                        <FaLightbulb className="text-lg" /> Key Highlights
                      </h3>
                      {(comparisonData.policy2.keyHighlights && comparisonData.policy2.keyHighlights.length > 0) || (comparisonData.policy2.highlights && comparisonData.policy2.highlights.length > 0) || (comparisonData.policy2.keyPoints && comparisonData.policy2.keyPoints.length > 0) ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {(comparisonData.policy2.keyHighlights || comparisonData.policy2.highlights || comparisonData.policy2.keyPoints || []).map((highlight, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-lime-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No highlights available</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Amendments/Changes Comparison */}
                {(comparisonData.policy1.amendments || comparisonData.policy1.changes || comparisonData.policy2.amendments || comparisonData.policy2.changes) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* Policy 1 Amendments */}
                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                        <FaExclamationTriangle className="text-lg" /> Amendments & Updates
                      </h3>
                      {comparisonData.policy1.amendments?.length > 0 || comparisonData.policy1.changes?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {(comparisonData.policy1.amendments || comparisonData.policy1.changes || []).map((amendment, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-indigo-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{amendment}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No amendments recorded</p>
                      )}
                    </div>

                    {/* Policy 2 Amendments */}
                    <div className="bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-bold text-violet-300 mb-4 flex items-center gap-2">
                        <FaExclamationTriangle className="text-lg" /> Amendments & Updates
                      </h3>
                      {comparisonData.policy2.amendments?.length > 0 || comparisonData.policy2.changes?.length > 0 ? (
                        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {(comparisonData.policy2.amendments || comparisonData.policy2.changes || []).map((amendment, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-300 text-sm">
                              <FaCheck className="text-violet-400 flex-shrink-0 mt-0.5 text-xs" />
                              <span className="break-words whitespace-normal">{amendment}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No amendments recorded</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Similarities Tab */}
            {activeTab === "similarities" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-green-300 mb-8 flex items-center gap-3">
                  <FaEquals className="text-xl" /> Similarities
                </h2>
                {comparisonData.insights.similarities.length > 0 ? (
                  <ul className="space-y-4">
                    {comparisonData.insights.similarities.map((item, idx) => (
                      <motion.li
                        key={`sim-${idx}-${item.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 text-white group items-start"
                      >
                        <FaCheck className="text-green-400 flex-shrink-0 mt-1 text-xl" />
                        <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-base">No similarities found</p>
                )}
              </motion.div>
            )}

            {/* Differences Tab */}
            {activeTab === "differences" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-red-300 mb-8 flex items-center gap-3">
                  <FaTimes className="text-xl" /> Differences
                </h2>
                {comparisonData.insights.differences.length > 0 ? (
                  <ul className="space-y-4">
                    {comparisonData.insights.differences.map((item, idx) => (
                      <motion.li
                        key={`diff-${idx}-${item.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 text-white group items-start"
                      >
                        <FaTimes className="text-red-400 flex-shrink-0 mt-1 text-xl" />
                        <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-base">No differences found</p>
                )}
              </motion.div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-blue-300 mb-8 flex items-center gap-3">
                  <FaCalendarAlt className="text-xl" /> Timeline Analysis
                </h2>
                {comparisonData.insights.timeline.length > 0 ? (
                  <ul className="space-y-4">
                    {comparisonData.insights.timeline.map((item, idx) => (
                      <motion.li
                        key={`timeline-${idx}-${item.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 text-white group items-start"
                      >
                        <span className="text-blue-400 font-bold text-xl flex-shrink-0 mt-1">●</span>
                        <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-base">Timeline information not available</p>
                )}
              </motion.div>
            )}

            {/* Relations Tab */}
            {activeTab === "relations" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-purple-300 mb-8 flex items-center gap-3">
                  <FaGavel className="text-xl" /> Legislative Relations
                </h2>
                {comparisonData.insights.relations.length > 0 ? (
                  <ul className="space-y-4">
                    {comparisonData.insights.relations.map((item, idx) => (
                      <motion.li
                        key={`rel-${idx}-${item.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 text-white group items-start"
                      >
                        <span className="text-purple-400 font-bold text-xl flex-shrink-0 mt-1">→</span>
                        <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-base">No specific relations identified</p>
                )}
              </motion.div>
            )}

            {/* Impact Tab */}
            {activeTab === "impact" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold text-yellow-300 mb-8 flex items-center gap-3">
                  <MdAnalytics className="text-xl" /> Impact Analysis
                </h2>
                {comparisonData.insights.impactAnalysis.length > 0 ? (
                  <ul className="space-y-4">
                    {comparisonData.insights.impactAnalysis.map((item, idx) => (
                      <motion.li
                        key={`impact-${idx}-${item.substring(0, 20)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 text-white group items-start"
                      >
                        <span className="text-yellow-400 font-bold text-xl flex-shrink-0 mt-1">◆</span>
                        <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-base">Impact analysis data not available</p>
                )}

                {/* Recommendations */}
                {comparisonData.insights.recommendations.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-yellow-500/20">
                    <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                      <MdInsights /> Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {comparisonData.insights.recommendations.map((rec, idx) => (
                        <motion.li
                          key={`rec-${idx}-${rec.substring(0, 20)}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex gap-4 text-white items-start"
                        >
                          <span className="text-orange-400 font-bold text-xl flex-shrink-0 mt-1">★</span>
                          <span className="text-base leading-relaxed break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: rec }}></span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Reset Button */}
            <motion.button
              onClick={() => {
                setComparisonData(null);
                setSelectedPolicy1(null);
                setSelectedPolicy2(null);
                setPolicy1("");
                setPolicy2("");
              }}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <FaSync /> Compare Different Policies
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PolicyComparison;
