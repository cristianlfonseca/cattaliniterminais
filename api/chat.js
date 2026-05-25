// api/chat.js — Vercel Serverless Function
// A chave da API fica segura aqui no servidor, nunca exposta ao navegador.

export default async function handler(req, res) {
  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY não configurada no servidor. Adicione a variável de ambiente na Vercel.',
    });
  }

  try {
    const { messages, systemInstruction } = req.body;

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      },
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return res.status(geminiRes.status).json({ error: errText });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('Erro na função serverless /api/chat:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
