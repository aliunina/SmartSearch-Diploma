import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const getSourcesJson = async (req, res) => {
  try {
    fs.readFile(process.env.SOURCES_PATH, "utf-8", (err, data) => {
      if (err) {
        throw new Error("Failed to read sources");
      }
      res.json(JSON.parse(data));
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};
