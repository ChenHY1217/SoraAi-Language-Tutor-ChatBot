const QUIZ_PROMPT = `You are a language learning expert. Generate 3 multiple-choice questions for language learning.
Return the response in the following JSON format only:
{
  "questions": [
    {
      "question": "The question text",
      "choices": [
        {"choice": "First option"},
        {"choice": "Second option"},
        {"choice": "Third option"},
        {"choice": "Fourth option"}
      ],
      "answer": "The correct answer text",
      "solution": "Brief explanation why this is correct",
    }
  ]
}

Focus on making questions that test both vocabulary and grammar appropriate for the specified levels.
Make sure the questions are challenging but fair for the given level.
Remember to return ONLY valid JSON, no additional text.`;

export default QUIZ_PROMPT;