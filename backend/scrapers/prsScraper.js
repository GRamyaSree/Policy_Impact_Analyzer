const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
require("dotenv").config();

const Policy = require("../models/policy");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for scraping"))
  .catch(err => console.error("DB Error:", err));

async function scrapePolicy(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("h1").first().text().trim();

    let content = "";
    $("p").each((i, el) => {
      content += $(el).text().trim() + "\n";
    });

    const summary = content.slice(0, 600);

    const policy = new Policy({
      title,
      content,
      summary
    });

    await policy.save();
    console.log("Saved:", title);

  } catch (err) {
    console.error("Scraping Error:", err.message);
  }
}

// Example URL (your PRS India link)
scrapePolicy("https://prsindia.org/policy/discussion-papers/impact-of-ujwal-discom-assurance-yojana-uday");
