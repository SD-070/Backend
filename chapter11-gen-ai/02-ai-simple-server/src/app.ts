import express from 'express';
import cors from 'cors';
import '#db';
import { completionRoutes } from '#routes';
import { errorHandler, notFoundHandler } from '#middleware';

import { OpenAI } from 'openai/client.js';

const app = express();
const port = process.env.PORT || '5050';

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_URL
});

app.use(cors({ origin: '*' }), express.json());

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  const result = await client.chat.completions.create({
    model: 'gemini-2.5-flash-lite',
    messages: [
      {
        role: 'system',
        content:
          'You are a Senior Software Architect. When asked specific questions about coding problems you NEVER answer with code, only with high-level overviews.'
      },
      { role: 'user', content: prompt }
    ],
    max_completion_tokens: 200
  });

  console.log(result.choices[0]?.message);

  res.json({ result: result.choices[0]?.message });
});

app.use('/ai', completionRoutes);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`\x1b[35mApp listening at http://localhost:${port}\x1b[0m`);
});
