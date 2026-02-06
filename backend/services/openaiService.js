// FINLIT - OpenAI Service
// Handles all AI-powered explanations and quiz generation

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate personalized explanation based on user's interest
async function generateExplanation(topic, interest, difficulty = 'beginner') {
  try {
    const prompt = `Explain "${topic}" to someone who loves ${interest}.
Difficulty: ${difficulty}

Format your response EXACTLY as:
🎯 THE ANALOGY (using ${interest} concepts)
[Your analogy here - make it relatable and engaging using ${interest} terminology]

💡 WHAT THIS ACTUALLY MEANS
[Clear explanation of the financial concept in simple terms]

🌍 REAL-LIFE EXAMPLE
[A concrete, practical example they can relate to]

🔑 KEY TAKEAWAY
[One memorable sentence they should remember]

Keep under 300 words, encouraging and friendly tone.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are FINLIT, an expert financial educator who makes finance relatable through personalized analogies. You explain complex financial concepts using analogies from different interests like gaming, sports, movies, fashion, etc. Keep explanations clear, encouraging, and under 300 words.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const explanation = response.choices[0].message.content;

    // Parse the response into structured format
    const sections = parseExplanation(explanation);

    return {
      success: true,
      explanation: sections,
      rawText: explanation
    };
  } catch (error) {
    console.error('OpenAI explanation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate quiz questions based on topic and interest
async function generateQuiz(topic, interest, difficulty = 'beginner') {
  try {
    const prompt = `Create 5 multiple-choice quiz questions about "${topic}" for someone who loves ${interest}.

Difficulty: ${difficulty}

Format each question EXACTLY as:
Q1: [Question text using ${interest} context]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
CORRECT: [A/B/C/D]
EXPLANATION: [Why this is correct, encouraging tone]

Make questions practical and relatable. Use ${interest} references where possible.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are FINLIT quiz master. Create engaging multiple-choice questions that test understanding of financial concepts. Make them practical and relatable to different interests.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const quizText = response.choices[0].message.content;
    const questions = parseQuiz(quizText);

    return {
      success: true,
      questions: questions
    };
  } catch (error) {
    console.error('OpenAI quiz error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Parse explanation into structured sections
function parseExplanation(text) {
  const sections = {
    analogy: '',
    meaning: '',
    example: '',
    takeaway: ''
  };

  try {
    // Extract each section using emoji markers
    const analogyMatch = text.match(/🎯 THE ANALOGY[\s\S]*?\n([\s\S]*?)(?=💡|$)/);
    const meaningMatch = text.match(/💡 WHAT THIS ACTUALLY MEANS[\s\S]*?\n([\s\S]*?)(?=🌍|$)/);
    const exampleMatch = text.match(/🌍 REAL-LIFE EXAMPLE[\s\S]*?\n([\s\S]*?)(?=🔑|$)/);
    const takeawayMatch = text.match(/🔑 KEY TAKEAWAY[\s\S]*?\n([\s\S]*?)$/);

    sections.analogy = analogyMatch ? analogyMatch[1].trim() : '';
    sections.meaning = meaningMatch ? meaningMatch[1].trim() : '';
    sections.example = exampleMatch ? exampleMatch[1].trim() : '';
    sections.takeaway = takeawayMatch ? takeawayMatch[1].trim() : '';
  } catch (error) {
    console.error('Error parsing explanation:', error);
  }

  return sections;
}

// Parse quiz questions into structured format
function parseQuiz(text) {
  const questions = [];

  try {
    // Split by question numbers
    const questionBlocks = text.split(/Q\d+:/).filter(block => block.trim());

    questionBlocks.forEach((block, index) => {
      const lines = block.split('\n').filter(line => line.trim());

      if (lines.length > 0) {
        const questionText = lines[0].trim();
        const options = [];
        let correctAnswer = '';
        let explanation = '';

        lines.forEach(line => {
          const trimmed = line.trim();

          // Extract options A-D
          if (/^[A-D]\)/.test(trimmed)) {
            options.push(trimmed.substring(2).trim());
          }

          // Extract correct answer
          if (trimmed.startsWith('CORRECT:')) {
            correctAnswer = trimmed.replace('CORRECT:', '').trim();
          }

          // Extract explanation
          if (trimmed.startsWith('EXPLANATION:')) {
            explanation = trimmed.replace('EXPLANATION:', '').trim();
          }
        });

        if (questionText && options.length === 4 && correctAnswer) {
          questions.push({
            id: index + 1,
            question: questionText,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
          });
        }
      }
    });
  } catch (error) {
    console.error('Error parsing quiz:', error);
  }

  return questions;
}

module.exports = {
  generateExplanation,
  generateQuiz
};
