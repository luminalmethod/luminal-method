export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  try {
    // Manually read the raw body stream
    const rawBody = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    if (!rawBody) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: rawBody,
    });

    const rawText = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(rawText || '{"error":"empty response from Anthropic"}');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
