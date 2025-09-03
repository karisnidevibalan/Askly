import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs";

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadMiddleware = multer({ storage }).single("file");

// Process uploaded file
export const processFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    // Return summary text
    res.json({
      summary: pdfData.text.substring(0, 1000), // limit output for now
    });
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
};
