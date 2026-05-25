import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin para simular o Vercel Serverless Function no ambiente local (npm run dev)
function vercelApiMock() {
  return {
    name: 'vercel-api-mock',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        
        let body = '';
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', async () => {
          try {
            const { messages, systemInstruction } = JSON.parse(body);
            const env = loadEnv(server.config.mode, process.cwd(), '');
            const apiKey = env.GEMINI_API_KEY;

            res.setHeader('Content-Type', 'application/json');

            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY não configurada no .env' }));
              return;
            }

            const payload = {
              system_instruction: { parts: [{ text: systemInstruction }] },
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
              res.statusCode = geminiRes.status;
              res.end(JSON.stringify({ error: errText }));
              return;
            }

            const data = await geminiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

            res.statusCode = 200;
            res.end(JSON.stringify({ text }));
          } catch (err) {
            console.error('Erro no /api/chat mock:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Erro interno no servidor local' }));
          }
        });
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMock()],
})
