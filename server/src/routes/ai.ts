import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/chat', async (req, res) => {
  const { messages } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const last = messages?.[messages.length - 1]?.content || '';
    return res.json({ reply: `AI (mock): You said: "${String(last).slice(0, 200)}"` });
  }

  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: messages || [{ role: 'user', content: 'Hello' }],
        temperature: 0.2,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const reply = data.choices?.[0]?.message?.content || 'No response';
    res.json({ reply });
  } catch (e: any) {
    res.status(200).json({ reply: 'AI error. Please try again later.' });
  }
});

export default router;


