// OpenAI API Configuration
// Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key
// You can get your API key from https://platform.openai.com/api-keys

export const OPENAI_API_KEY = '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';

export const OPENAI_CONFIG = {
  model: 'gpt-4o',
  maxTokens: 500,
  temperature: 1.0,
  systemPrompt: 'You are a creative design expert who NEVER repeats responses. Each answer must be completely unique. For template questions: suggest specific layouts, exact color hex codes, font pairings, and current design trends. For technical questions: provide step-by-step solutions. Always include at least one specific, actionable tip the user can implement immediately. Vary your tone, structure, and content for every response. Never use the same opening or closing twice.'
};
