import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import PolicySearch from "./pages/policysearch";
import PolicyComparison from "./pages/policycomparison";
import ImpactScoreCard from "./pages/impactscorecard";
import ReportSharing from "./pages/reportsharing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policysearch" element={<PolicySearch />} />
        <Route path="/policycomparison" element={<PolicyComparison />} />
        <Route path="/impactscore" element={<ImpactScoreCard />} />
        <Route path="/reportsharing" element={<ReportSharing />} />
        
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
