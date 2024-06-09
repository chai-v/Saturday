import Tesseract from 'tesseract.js';
import sharp from 'sharp';

// Function to preprocess the image
async function preprocessImage(inputPath, outputPath) {
  await sharp(inputPath)
    .grayscale()
    .normalize()
    .resize({ width: 1000 })
    .sharpen()
    .toFile(outputPath);
}

// Function to recognize text from the preprocessed image
async function recognizeText(imagePath) {
  const preprocessedImagePath = './preprocessed_image.jpeg';
  await preprocessImage(imagePath, preprocessedImagePath);

  const result = await Tesseract.recognize(preprocessedImagePath, 'eng', {
    logger: e => console.log(e)
  });

  return result.data.text;
}

// Function to extract questions from recognized text
function extractQuestions(text) {
  const lines = text.split('\n');
  const cleanedLines = lines.map(line => line.trim()).filter(line => line);

  const questions = [];
  let currentQuestion = '';

  cleanedLines.forEach(line => {
    if (line.match(/^\d+\./) || line.match(/^[a-e]\./) || line.match(/^\d+\)$/) || line.match(/^\d+[a-z]\./)) {
      if (currentQuestion) {
        questions.push(currentQuestion.trim());
      }
      currentQuestion = line;
    } else {
      if (currentQuestion) {
        currentQuestion += ' ' + line;
      }
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion.trim());
  }

  // Remove side headings and unwanted characters
  return questions.map(q => q.replace(/[^a-zA-Z0-9.,? ]/g, '').trim())
                  .filter(q => q.length > 0 && !q.toLowerCase().includes("marks"));
}

// Function to process files (images) and extract questions
async function processFiles(filePaths) {
  const textChunks = [];

  for (const filePath of filePaths) {
    const text = await recognizeText(filePath);
    const questions = extractQuestions(text);
    textChunks.push({ filename: filePath, chunks: questions });
  }
  console.log(textChunks)
  return textChunks;
}

export { processFiles };
