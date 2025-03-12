const Tesseract = require("tesseract.js");
const path = require("path");

// Path to the image
const imagePath = path.join(__dirname, "sample.jpg");

function recognizeText() {
// Perform OCR on the image
    Tesseract.recognize(
    imagePath,             // Image file
    "eng+por+spa",                 // Language (English)
    {
        logger: m => console.log(m) // Log progress
    }
    ).then(({ data: { text } }) => {
    console.log("Recognized Text:");
    console.log(text);
    }).catch(error => {
    console.error("Error:", error);
    });
    }

module.exports = { recognizeText };