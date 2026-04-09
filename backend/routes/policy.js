const express = require("express");
const Policy = require("../models/policy");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    let filter = {};

    if (q) {
      filter = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
          { summary: { $regex: q, $options: "i" } },
          { ministry: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { targetAudience: { $regex: q, $options: "i" } },
          { principalBill: { $regex: q, $options: "i" } },
          { implementation: { $regex: q, $options: "i" } },
          { objectives: { $regex: q, $options: "i" } },
          { benefits: { $regex: q, $options: "i" } },
          { keyHighlights: { $regex: q, $options: "i" } },
          { challenges: { $regex: q, $options: "i" } },
          { debates: { $regex: q, $options: "i" } }
        ]
      };
    }

    const data = await Policy.find(filter);
    res.json(data);
  } catch (err) {
    console.error("Policy API Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
