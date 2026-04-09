import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const features = [
{
  title: "Advanced Policy Search",
  path: "/policysearch",
  desc:
    "Search and navigate government policies through a structured interface designed to simplify document discovery. Locate relevant clauses, amendments, and references across policy archives with improved organization and clarity. This feature supports focused exploration without replacing the need for careful review.",
},
 {
  title: "Policy Comparison",
  path: "/policycomparison",
  desc:
    "Compare policies side by side to examine differences in structure, wording, and scope. This feature assists in identifying changes across versions or jurisdictions, helping users better understand how legislative frameworks evolve over time.",
},
  // {
  //   title: "AI Summarization",
  //   desc:
  //     "Transform lengthy policy documents into concise, human-readable summaries while preserving legal meaning and contextual importance.",
  // },
  // {
  //   title: "Trend Visualization",
  //   desc:
  //     "Visualize emerging policy trends and discourse patterns over time to understand momentum, decline, and public focus areas.",
  // },
  // {
  //   title: "Public vs Parliament",
  //   desc:
  //     "Contrast public opinion with parliamentary debates to reveal alignment gaps, consensus zones, and democratic disconnects.",
  // },
  // {
  //   title: "Predictive Insights",
  //   desc:
  //     "Leverage AI-driven models to forecast policy impact, adoption likelihood, and potential socio-economic outcomes.",
  // },
  {
    title: "Impact Scorecard",
    path: "/impactscore",
    desc:
      "Measure policy effectiveness through quantified impact scores based on reach, reception, and projected outcomes.",
  },
  {
    title: "Reports & Sharing",
    path: "/reportsharing",
    desc:
      "Generate professional reports and share insights seamlessly with stakeholders, researchers, and decision-makers.",
  },
];

const Dashboard = () => {
const location = useLocation();

const [showIntro, setShowIntro] = useState(
  location.state?.skipIntro ? false : true
);


  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 7000);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();


  return (
    <div
      className="min-h-screen w-full bg-cover transition-all duration-1000"
      style={{
        backgroundImage: showIntro
          ? "url('/images/parliament_sabha.png')"
          : "url('/images/newspaper2.png')",
        backgroundPosition: showIntro
          ? "center 35%"
          : "center -73px",
        cursor: "default",
      }}
    >
      <div
        className={`min-h-screen relative overflow-hidden flex items-center justify-center ${
          showIntro ? "bg-black/75" : ""
        }`}
      >
        {/* 🌌 INTRO — UNTOUCHED */}
        {showIntro && (
          <>
            {[...Array(90)].map((_, i) => (
              <span
                key={`star-${i}`}
                className="star"
                style={{
                  left: Math.random() * 100 + "%",
                  animationDelay: Math.random() * 10 + "s",
                }}
              />
            ))}

            {[...Array(35)].map((_, i) => (
              <span
                key={`meteor-${i}`}
                className="meteor"
                style={{
                  left: Math.random() * 100 + "%",
                  animationDelay: Math.random() * 6 + "s",
                }}
              />
            ))}

            <h1 className="text-4xl md:text-6xl font-extrabold text-center z-10 animate-fadeIn">
              <span className="block text-slate-200 tracking-wide">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl leading-[1.25]">
                Policy Impact Analyzer
              </span>
            </h1>
          </>
        )}

        {/* 📰 NEWSPAPER CONTENT */}
        {!showIntro && (
          <div className="newspaper-container animate-fadeInSlow">
            <div className="newspaper-offset">
              <div className="newspaper-columns">
                {features.map((item, index) => (
                  <div key={index} className="news-block">
                    <button
                      className="headline-btn"
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path, { state: { skipIntro: true } });
                        }
                      }}
                    >
                      {item.title}
                    </button>

                    <div className="editorial-divider small" />
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* ===== PAPER GRAIN ===== */
        .newspaper-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* 🌸 MOVE TEXT DOWN CLEANLY */
        .newspaper-offset {
          margin-top: 8rem;
        }

        /* ===== STARS ===== */
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          top: -10px;
          opacity: 0.6;
          animation: starFall 18s linear infinite, twinkle 3s ease-in-out infinite;
        }

        .meteor {
          position: absolute;
          width: 2px;
          height: 140px;
          background: linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0));
          top: -160px;
          animation: meteorFall 5s linear infinite;
        }

        /* ===== NEWSPAPER LAYOUT ===== */
        .newspaper-container {
          position: relative;
          max-width: 1400px;
          padding: 4.2rem 1.5rem;
          margin-top: 2rem;
          font-family: "Cormorant Garamond", "Georgia", serif;
          color: #3b2a1e;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .newspaper-columns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 4.2rem;
          row-gap: 4rem;
        }

      .news-block {
  position: relative;
  padding: 0.6rem 0.9rem 0.8rem;
  margin: -0.6rem -0.9rem -0.8rem;
  border-radius: 6px;

  padding-right: 2rem;
  border-right: 1px solid rgba(60,45,35,0.25);

  transition:
    background-color 260ms ease,
    box-shadow 260ms ease,
    transform 220ms ease;
}

/* 🌫️ FEATURE HOVER HIGHLIGHT */
.news-block:hover {
  background-color: rgba(73, 5, 100, 0.22);
  box-shadow: inset 0 0 0 1px rgba(90, 65, 40, 0.08);
  transform: translateY(-1px);
}

.news-block:hover p {
  color: #2b1f17;
}

.news-block:hover .headline-btn {
  color: #1b120c;
}



        .news-block:nth-child(3n) {
          border-right: none;
        }

        /* ===== HEADLINE ===== */
        .headline-btn {
          all: unset;
          cursor: pointer;
          display: block;
          font-family: "Playfair Display", serif;
          font-size: 1.34rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #2a1f18;
          margin-bottom: 0.4rem;
          transition: color 180ms ease, transform 180ms ease;
        }

        .headline-btn:hover {
          color: #1f160f;
          transform: translateY(-2px);
        }

        /* ===== DROP CAP ===== */
        .news-block p::first-letter {
          float: left;
          font-size: 3rem;
          line-height: 0.9;
          padding-right: 0.44rem;
          font-weight: 700;
          color: #2d2018;
        }

        .news-block p {
          font-size: 1.05rem;
          line-height: 1.85;
          letter-spacing: 0.02em;
          color: #3f2f24;
          text-align: justify;
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
          hyphens: auto;
          widows: 2;
          orphans: 2;
        }

        .editorial-divider.small {
          height: 1px;
          margin: 0.8rem 0 1.1rem;
          background: rgba(60,45,35,0.45);
        }

        /* ===== RESPONSIVE: keep text readable, don't touch image position ===== */
        @media (max-width: 1100px) {
          .newspaper-columns {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 2.2rem;
            row-gap: 2.6rem;
          }
        }

        @media (max-width: 640px) {
          .newspaper-offset {
            margin-top: 6rem;
          }

          .newspaper-columns {
            grid-template-columns: 1fr;
            column-gap: 1rem;
          }

          .headline-btn {
            font-size: 1.15rem;
          }

          .news-block p::first-letter {
            font-size: 2.2rem;
            padding-right: 0.35rem;
          }
        }

        /* ===== ANIMATIONS ===== */
        @keyframes starFall {
          from { transform: translateY(-10vh); }
          to { transform: translateY(120vh); }
        }

        @keyframes meteorFall {
          from { transform: translateY(-20vh); }
          to { transform: translateY(120vh); }
        }

        @keyframes twinkle {
          0%,100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 2s ease-out;
        }

        .animate-fadeInSlow {
          animation: fadeIn 3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
