# AI Template Editor - Chatbot Setup

## OpenAI API Configuration

To enable the AI chatbot functionality, you need to configure your OpenAI API key:

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key

### Step 2: Configure the API Key
1. Open the file: `src/config/openai.js`
2. Replace `YOUR_OPENAI_API_KEY` with your actual API key:

```javascript
export const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
```

### Step 3: Restart the Development Server
Stop the current server (Ctrl+C) and restart it:
```bash
npm start
```

## Features

The AI chatbot can help you with:
- Template design suggestions
- Color palette recommendations
- Layout ideas
- Technical questions about the editor
- Creative inspiration

## Usage

1. Type your question in the chat input
2. Press Enter or click "Send"
3. The AI will respond with helpful suggestions
4. You can also upload images/videos for context

## Troubleshooting

**If the chatbot doesn't respond:**
1. Check that your OpenAI API key is correctly configured
2. Ensure you have sufficient API credits
3. Check the browser console for error messages

**Rate Limits:**
- Free tier accounts have limited API usage
- Consider upgrading your OpenAI plan for higher limits

## Cost

- Using GPT-3.5-turbo costs approximately $0.002 per 1K tokens
- Each response uses ~150 tokens maximum
- This is very cost-effective for the functionality provided
