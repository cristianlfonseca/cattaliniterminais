// src/services/geminiService.js
// Serviço que se conecta à função serverless /api/chat
// Com fallback inteligente de simulação para demos sem API key

import {
  COMPANY_OVERVIEW,
  OPERATIONAL_CONTEXT,
  ORGANIZATIONAL_AREAS,
  COMPLIANCE_CONTEXT,
  ESG_CONTEXT,
  BUSINESS_ENTITIES,
  PROCESS_TAXONOMY,
  SYSTEM_CONTEXT,
  PROCESS_DISCOVERY_RULES,
  BPM_OUTPUT_TEMPLATE,
  INTERVIEW_GUIDE,
  AI_AGENT_RULES
} from './cattaliniKnowledge.js';

const SYSTEM_INSTRUCTION = `Você é um especialista em Engenharia de Processos, BPM, Discovery Operacional, Automação Corporativa e Arquitetura Empresarial.

Sua função é atuar como um analista sênior de processos dentro da empresa Cattalini Terminais Marítimos.

Seu objetivo é:
* conduzir levantamentos AS-IS,
* mapear processos,
* identificar gargalos, riscos, controles manuais e oportunidades de automação,
* estruturar fluxos BPM,
* gerar documentação técnica profissional.

IMPORTANTE:
Você NÃO deve inventar processos inexistentes.
Você NÃO deve assumir sistemas, integrações ou regras sem confirmação.
Quando houver incerteza: sinalize como hipótese, solicite validação, diferencie fato de inferência.

=================================================================
BASE DE CONHECIMENTO E CONTEXTO DA EMPRESA
==========================================
${COMPANY_OVERVIEW}
${OPERATIONAL_CONTEXT}
${ORGANIZATIONAL_AREAS}
${COMPLIANCE_CONTEXT}
${ESG_CONTEXT}
${BUSINESS_ENTITIES}
${PROCESS_TAXONOMY}
${SYSTEM_CONTEXT}

=================================================================
REGRAS E MODO DE ATUAÇÃO
========================
${PROCESS_DISCOVERY_RULES}
${INTERVIEW_GUIDE}
${AI_AGENT_RULES}

=================================================================
ESTRUTURA OBRIGATÓRIA DE RESPOSTA (JSON)
========================================

Para que nossa interface de diagramas funcione, você deve SEMPRE e OBRIGATORIAMENTE retornar um único JSON contendo os dados estruturados e a sua resposta em texto.

Formato:
{
  "message": "Sua resposta técnica para o analista. Sempre que for mapear um processo, AQUI NESTE CAMPO você deve organizar o texto rigorosamente usando o modelo: ${BPM_OUTPUT_TEMPLATE} com as marcações de # Processo, # Objetivo, etc. Faça perguntas estruturadas.",
  "processData": {
    "steps": [{ "id": "1", "label": "Nome da etapa", "type": "start|process|decision|end|system", "system": "ERP|Excel|Email|Manual", "responsible": "Cargo", "duration": "X dias", "pain": "Gargalo (opcional)" }],
    "improvements": [{ "title": "Título da melhoria", "from": "Situação atual", "to": "Situação proposta", "impact": "high|medium|low", "roiHours": 10 }]
  },
  "activeTab": "diagram|improvements"
}

Se ainda estiver fazendo discovery e não tiver dados para gerar o fluxo visual, retorne "processData" como null.
Seja extremamente analítico. Quebre processos complexos e detecte inconsistências operacionais.`;

// -------------------------------------------------------
// Dados mock realistas para demonstração sem API key
// -------------------------------------------------------
const MOCK_RESPONSES = {
  default: {
    message: `Olá! Sou o **ProcessSync AI**, seu co-piloto para mapeamento e melhoria de processos corporativos. 🚀

Posso te ajudar com:
- 📊 **Mapear processos AS-IS** — descreva o fluxo atual e eu estruturo visualmente
- 💡 **Propor melhorias TO-BE** — identifico gargalos e sugiro otimizações com ROI

Por onde vamos começar?`,
    processData: null, activeTab: null,
  },

  requisicao: {
    message: `Entendi o processo de **Requisição de Compras**! Mapeei o fluxo AS-IS e identifiquei **3 gargalos críticos**. Veja o diagrama gerado ao lado e os pontos de melhoria com estimativa de ROI. 📊`,
    processData: {
      steps: [
        { id: '1', label: 'Necessidade identificada', type: 'start', system: 'Manual', responsible: 'Analista', duration: '1h', pain: null },
        { id: '2', label: 'Preenche requisição\n(planilha Excel)', type: 'process', system: 'Excel', responsible: 'Analista', duration: '2h', pain: 'Preenchimento manual e suscetível a erros' },
        { id: '3', label: 'Envia por e-mail\npara aprovação', type: 'process', system: 'Email', responsible: 'Analista', duration: '30min', pain: 'Falta de rastreabilidade e risco de perda' },
        { id: '4', label: 'Gestor aprova?', type: 'decision', system: 'Manual', responsible: 'Gestor', duration: '2-5 dias', pain: 'Gargalo crítico: aprovação sem SLA definido' },
        { id: '5', label: 'Lança no Sistema', type: 'process', system: 'ERP', responsible: 'Analista', duration: '1h', pain: 'Retrabalho: dados já digitados no Excel' },
        { id: '6', label: 'Requisição criada', type: 'end', system: 'ERP', responsible: 'Sistema', duration: '-', pain: null },
      ],
      improvements: [
        { title: 'Digitalizar requisição direto no ERP', from: 'Planilha Excel + e-mail manual', to: 'Formulário no sistema com validações automáticas', impact: 'high', roiHours: 40 },
        { title: 'Fluxo de aprovação eletrônico', from: 'Aprovação por e-mail sem SLA', to: 'Workflow integrado com SLA de 24h e alertas automáticos', impact: 'high', roiHours: 60 },
        { title: 'Eliminar retrabalho de digitação', from: 'Dados digitados 2x (Excel e Sistema)', to: 'Lançamento único no ERP com integração', impact: 'medium', roiHours: 20 },
      ],
    },
    activeTab: 'diagram',
  },



  melhoria: {
    message: `Com base no processo descrito, identifiquei **oportunidades de melhoria de alto impacto**. Gerei um plano TO-BE completo com estimativa de ROI ao lado. 💡`,
    processData: {
      steps: [
        { id: '1', label: 'Necessidade identificada', type: 'start', system: 'ERP', responsible: 'Solicitante', duration: '30min', pain: null },
        { id: '2', label: 'Requisição criada\nautomaticamente', type: 'process', system: 'ERP', responsible: 'Sistema', duration: '5min', pain: null },
        { id: '3', label: 'Aprovação eletrônica\ncom SLA 24h', type: 'decision', system: 'ERP', responsible: 'Gestor', duration: '24h', pain: null },
        { id: '4', label: 'Pedido gerado\nautomaticamente', type: 'process', system: 'ERP', responsible: 'Sistema', duration: '1h', pain: null },
        { id: '5', label: 'Fornecedor notificado\nautomaticamente', type: 'end', system: 'ERP', responsible: 'Sistema', duration: '-', pain: null },
      ],
      improvements: [
        { title: 'Automação do fluxo end-to-end', from: 'Processo 100% manual com 5+ dias de lead time', to: 'Fluxo digital integrado no ERP com lead time de 24-48h', impact: 'high', roiHours: 120 },
        { title: 'Dashboard de acompanhamento', from: 'Coleta manual de dados em planilhas', to: 'Relatórios automáticos com indicadores no sistema', impact: 'high', roiHours: 80 },
        { title: 'Treinamento gamificado', from: 'Analistas sem know-how no sistema gerando retrabalho', to: 'Simulador interativo com guias contextuais no ERP', impact: 'medium', roiHours: 45 },
      ],
    },
    activeTab: 'improvements',
  },
  empresa: {
    message: `A **Cattalini Terminais Marítimos** é o maior terminal privado independente de granéis líquidos do Brasil, localizado no Porto de Paranaguá/PR.\n\nSomos uma Empresa B certificada, com foco em segurança, sustentabilidade (ESG) e operações portuárias de excelência. Possuímos 137 tanques com capacidade superior a 618 mil m³ para armazenagem de óleos vegetais, químicos e combustíveis.\n\nComo ProcessSync AI integrado à base de conhecimento, posso responder dúvidas sobre a Cattalini ou te ajudar a mapear processos!`,
    processData: null,
    activeTab: null,
  },
};

function detectIntent(text) {
  const lower = text.toLowerCase();
  if (lower.match(/cattalini|empresa|quem somos|sobre|terminal|serviços|capacidade/)) return 'empresa';
  if (lower.match(/requisição|solicitação|pedido|compra|aquisição|processo de compra/)) return 'requisicao';
  if (lower.match(/melhoria|otimiz|gargalo|to-be|proposta|sugestão|problema/)) return 'melhoria';
  return 'default';
}

// -------------------------------------------------------
// Serviço principal
// -------------------------------------------------------
export class GeminiService {
  constructor() {
    this.history = [];
    this.isMockMode = false;
  }

  async sendMessage(userText) {
    this.history.push({ role: 'user', parts: [{ text: userText }] });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.history,
          systemInstruction: SYSTEM_INSTRUCTION,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.text || '';

      // Tenta parsear JSON estruturado da resposta
      let parsed;
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { message: rawText, processData: null, activeTab: null };
      } catch {
        parsed = { message: rawText, processData: null, activeTab: null };
      }

      this.history.push({ role: 'model', parts: [{ text: rawText }] });
      this.isMockMode = false;
      return parsed;

    } catch (err) {
      console.warn('API indisponível, usando modo demonstração:', err.message);
      this.isMockMode = true;
      const intent = detectIntent(userText);
      const mock = MOCK_RESPONSES[intent] || MOCK_RESPONSES.default;
      this.history.push({ role: 'model', parts: [{ text: mock.message }] });
      return mock;
    }
  }

  clearHistory() {
    this.history = [];
  }
}

export const geminiService = new GeminiService();
