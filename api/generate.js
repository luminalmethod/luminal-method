export const maxDuration = 60;
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return exactly what we received
  return res.status(200).json({
    receivedBody: req.body,
    bodyType: typeof req.body,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10),
  });
}
