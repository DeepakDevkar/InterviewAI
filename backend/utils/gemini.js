import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger.js';

export const generateInterviewQuestions = async ({
  role,
  difficulty = 'medium',
  company = 'a general tech firm',
  technology = '',
  experience = '',
  questionsCount = 5
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback mock questions in case API key is missing or invalid
  const getMockQuestions = () => {
    logger.warn('Gemini API key missing or invalid. Returning mock generated questions.');
    
    const mockDb = [
      {
        text: 'What is the primary difference between a controlled and uncontrolled component in React?',
        type: 'technical',
        difficulty,
        options: [],
        correctOptionIndex: null,
        skeletonCode: null,
        testCases: []
      },
      {
        text: 'Describe a situation where you had a conflict with a technical lead regarding architectural design. How did you resolve it?',
        type: 'behavioral',
        difficulty,
        options: [],
        correctOptionIndex: null,
        skeletonCode: null,
        testCases: []
      },
      {
        text: 'Write a function to find the first non-repeating character in a string and return its index. If it does not exist, return -1.',
        type: 'coding',
        difficulty,
        options: [],
        correctOptionIndex: null,
        skeletonCode: `function firstUniqChar(s) {\n  // Write solution here\n  return -1;\n}`,
        testCases: [
          { input: '"leetcode"', expectedOutput: '0' },
          { input: '"loveleetcode"', expectedOutput: '2' },
          { input: '"aabb"', expectedOutput: '-1' }
        ]
      },
      {
        text: 'Which of the following hook categories executes synchronously AFTER all DOM mutations in React?',
        type: 'mcq',
        difficulty,
        options: [
          'useEffect',
          'useLayoutEffect',
          'useInsertionEffect',
          'useMemo'
        ],
        correctOptionIndex: 1,
        skeletonCode: null,
        testCases: []
      },
      {
        text: 'Scenario: Your production Node.js API server is spiking to 100% CPU usage during peak hours, and users report 504 gateway timeout errors. Outline your step-by-step debugging flow.',
        type: 'scenario',
        difficulty,
        options: [],
        correctOptionIndex: null,
        skeletonCode: null,
        testCases: []
      }
    ];

    // Slice based on count requested
    return { questions: mockDb.slice(0, questionsCount) };
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return getMockQuestions();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
      You are an elite developer technical interviewer. Generate a structured mock interview session for a candidate with these details:
      - Job Target Role: ${role}
      - Target Interviewing Company: ${company}
      - Core Technologies/Keywords: ${technology}
      - Target Difficulty Level: ${difficulty}
      - Candidate CV Profile Summary context: ${experience}

      Generate exactly ${questionsCount} interview questions. You MUST provide a diverse mix including:
      - Technical questions (theoretical concepts)
      - Behavioral questions (STAR format)
      - Coding questions (require skeletonCode and simple unit test inputs)
      - MCQ questions (Multiple choice - provide options array and correctOptionIndex)
      - Scenario questions (production bottlenecks, system failures, design decisions)

      You must return a valid JSON object matching this schema:
      {
        "questions": [
          {
            "text": "The detailed question text context...",
            "type": "technical" | "behavioral" | "coding" | "mcq" | "scenario",
            "difficulty": "easy" | "medium" | "hard",
            "options": ["A...", "B...", "C...", "D..."], // Populate ONLY if type is 'mcq', else empty array
            "correctOptionIndex": 1, // Populate ONLY if type is 'mcq' (0-indexed index of correct choice), else null
            "skeletonCode": "function solve() {\\n  // code\\n}", // Populate ONLY if type is 'coding', else null
            "testCases": [
              { "input": "input params", "expectedOutput": "expected return value" }
            ] // Populate ONLY if type is 'coding', else empty array
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse response
    const parsedData = JSON.parse(responseText);
    
    if (parsedData && Array.isArray(parsedData.questions)) {
      return parsedData;
    }
    
    throw new Error('Invalid questions format returned from Gemini');
  } catch (error) {
    logger.error('Gemini content generation failed:', error);
    return getMockQuestions();
  }
};

export const evaluateInterviewAnswers = async ({
  role,
  difficulty = 'medium',
  questionsAndAnswers = []
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback mock evaluations generator
  const getMockEvaluations = () => {
    logger.warn('Gemini API key missing or invalid. Returning mock evaluations report.');

    const improvedAnswers = questionsAndAnswers.map((q) => {
      let suggestions = 'Verify vocabulary matches core standards. Provide clean documentation notes.';
      let improvedAnswerText = 'A comprehensive answer would detail framework internals, caching decorators, and exception handlers.';

      if (q.type === 'mcq') {
        const correctOpt = q.options && q.correctOptionIndex !== null ? q.options[q.correctOptionIndex] : 'the designated key option';
        suggestions = `This was an MCQ. The correct choice is: ${correctOpt}.`;
        improvedAnswerText = `Correct Option is choice index ${q.correctOptionIndex}: "${correctOpt}".`;
      } else if (q.type === 'coding') {
        suggestions = 'Optimize execution loops and simplify variable complexity checks.';
        improvedAnswerText = 'A clean solution would utilize linear loops or maps hash checks to maintain time constraints.';
      }

      return {
        questionId: q._id,
        questionText: q.text,
        userAnswer: q.userAnswer || 'No response recorded.',
        suggestions,
        improvedAnswerText
      };
    });

    return {
      overallScore: 84,
      technicalScore: 86,
      communicationScore: 82,
      confidenceScore: 85,
      grammarScore: 88,
      strengths: [
        'Clear knowledge of core software design principles.',
        'Accurate solutions to algorithm challenges.',
        'Proper grammar and structured syntax usage.'
      ],
      weaknesses: [
        'Minor formatting issues inside text responses.',
        'Could include more concrete examples for system design scenario topics.'
      ],
      generalSuggestions: 'Work on decreasing speech pauses. Incorporate production debugging logs to detail your scenario answers.',
      improvedAnswers
    };
  };

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return getMockEvaluations();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
      You are an expert technical recruiter. Evaluate this mock interview session:
      - Target Job Role: ${role}
      - Session Difficulty: ${difficulty}
      
      Here is the candidate's conversation log containing question descriptions, types, correct MCQ choices, and the candidate's answers:
      ${JSON.stringify(questionsAndAnswers, null, 2)}

      Assess the candidate's answers and compute five scoring dimensions (scores from 0 to 100):
      1. technicalScore: Accuracy of technical code, frameworks internals, systems concepts.
      2. communicationScore: Fluidity, vocabulary alignment, structured descriptions.
      3. confidenceScore: Bold declarations, lack of conversational filler keywords.
      4. grammarScore: Sentence structure, syntax correctness, spelling.
      5. overallScore: Average weighting of the individual dimensions.

      For each question-answer pair, output:
      - Suggestions on how the user could perform better.
      - improvedAnswerText: Write an exemplary, comprehensive answer template that the candidate should use.

      You must return a valid JSON object matching this schema:
      {
        "overallScore": 85,
        "technicalScore": 90,
        "communicationScore": 80,
        "confidenceScore": 85,
        "grammarScore": 90,
        "strengths": ["Strength detail A", "Strength detail B"],
        "weaknesses": ["Improvement detail A", "Improvement detail B"],
        "generalSuggestions": "A general evaluation overview for the candidate...",
        "improvedAnswers": [
          {
            "questionId": "The ID string of the question",
            "questionText": "The text of the question",
            "userAnswer": "The user answer provided",
            "suggestions": "Actionable feedback for this question specifically",
            "improvedAnswerText": "Model exemplar answer text..."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const parsedData = JSON.parse(responseText);
    
    if (parsedData && typeof parsedData.overallScore === 'number') {
      return parsedData;
    }
    
    throw new Error('Invalid evaluation format returned from Gemini');
  } catch (error) {
    logger.error('Gemini answer evaluation failed:', error);
    return getMockEvaluations();
  }
};
