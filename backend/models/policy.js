const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  ministry: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Proposed', 'Archived'],
    default: 'Active'
  },
  benefits: {
    type: [String],
    default: []
  },
  targetAudience: {
    type: String,
    default: ""
  },
  budget: {
    type: String,
    default: ""
  },
  objectives: {
    type: [String],
    default: []
  },
  implementation: {
    type: String,
    default: ""
  },
  parliamentDiscussions: {
    type: String,
    default: ""
  },
  debates: {
    type: [String],
    default: []
  },
  amendments: {
    type: [String],
    default: []
  },
  approvalDate: {
    type: Date,
    default: null
  },
  principalBill: {
    type: String,
    default: ""
  },
  keyHighlights: {
    type: [String],
    default: []
  },
  challenges: {
    type: [String],
    default: []
  },
  futureProspects: {
    type: String,
    default: ""
  },
  // SOURCE DOCUMENTATION FOR ACADEMIC INTEGRITY
  sourceDocumentation: {
    sources: [
      {
        sourceNumber: Number,           // 1, 2, 3...
        sourceName: String,              // e.g., "Ministry of Education Official Website"
        sourceType: String,              // e.g., "Government Website", "PDF", "Database"
        sourceURL: String,               // Link if available
        dataParts: [String],             // What data came from this source (e.g., ["Title", "Summary", "Objectives"])
        percentageOfData: Number,        // e.g., 60
        accessDate: Date                 // When the data was accessed
      }
    ],
    customAnalysisPercentage: {
      type: Number,
      default: 0                         // % of data that is custom analysis
    },
    notes: String,                       // Additional notes about sourcing
    lastUpdated: Date,                   // When source documentation was last updated
    verifiedBy: String                   // Name of person who verified sources
  }
}, { timestamps: true });

module.exports = mongoose.model("Policy", PolicySchema);
