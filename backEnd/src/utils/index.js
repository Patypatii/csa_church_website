import logger from "../logger/winston.js";

export const parseQuestionBlock = (block) => {
  // Normalize each line: lowercase, strip bold markers, trim spaces
  const normalizeLine = (line) =>
    line.toLowerCase().replace(/\*\*/g, "").trim();

  const lines = block
    .split("\n")
    .map((l) => normalizeLine(l))
    .filter(Boolean);

  // First line must look like "1. Question..."
  let questionText = lines[0]?.replace(/^\d+[\.\)]\s*/, "");
  if (!questionText) questionText = "Untitled question";

  // Next 4 lines = options (A, B, C, D) in flexible formats
  const answers = lines
    .slice(1, 5)
    .map((line) => {
      // Accept A) A. A : A - N) etc.
      const match = line.match(/^([a-dn])[\s\.\):-]\s*(.*)$/i);
      if (!match) return null;
      return {
        option: `${match[1].toLowerCase()})`,
        text: match[2] || "Answer not provided",
      };
    })
    .filter(Boolean);

  if (answers.length !== 4) return null;

  // Find correct answer line
  const answerLine = lines.find((l) => /correct answer:/i.test(l));
  if (!answerLine) return null;

  // Correct Answer line parsing
  const match = answerLine.match(
    /correct answer:\s*([a-dn])?[\s\.\)>-]?\s*(.*)?/i,
  );

  let correctOption = match && match[1] ? `${match[1].toLowerCase()})` : "a)";
  let correctAnswerText =
    answers.find((a) => a.option === correctOption)?.text ||
    match?.[2] ||
    "Answer not provided";

  // Explanation fallback
  const explanationLine = lines.find((l) => /explanation:/i.test(l));
  const explanation = explanationLine
    ? explanationLine.replace(/explanation:\s*/i, "")
    : "Explanation not provided";

  return {
    questionText: questionText || "Untitled question",
    answers,
    correctAnswer: {
      option: correctOption || "a)",
      text: correctAnswerText || "Answer not provided",
      explanation: explanation || "Explanation not provided",
    },
  };
};

export const sansitiseAndParseQuestionBlock = (content) => {
  const blocks = content.split(/(?:\n\s*\n|---)/);

  const questionsArray = blocks.map((block, i) => {
    const parsed = parseQuestionBlock(block);
    console.log(`Parsed block #${i}:`);

    if (!parsed) {
      console.log(`Block #${i} is malformed and will be skipped.`);
      logger.warn(`Skipping malformed block #${i}`);
      return null;
    }

    return { ...parsed, createdAt: new Date() };
  });
  // Log raw array including nulls
  // Filter out nulls before DB insert
  const validQuestions = questionsArray.filter(Boolean);

  if (validQuestions.length === 0) {
    logger.error("No valid questions parsed from Groq output");
    return [];
  }

  return validQuestions;
};
