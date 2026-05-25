import { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

const QUICK_PROMPTS = [
  { icon: '📊', label: 'Mapear processo de compras', text: 'Quero mapear o processo de requisição de compras da empresa. O analista preenche uma planilha Excel, envia por e-mail para aprovação do gestor, que pode demorar dias para responder. Depois disso lança manualmente no sistema corporativo.' },
  { icon: '💡', label: 'Propor melhorias TO-BE', text: 'Com base no processo de compras atual, quero que você proponha melhorias e gere um plano TO-BE com estimativa de ROI.' }
]

function TypingIndicator() {
  return (
    <div className="chat-message agent">
      <div className="agent-avatar"><span>AI</span></div>
      <div className="message-bubble agent-bubble typing-bubble">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

function MessageFeedback() {
  const [feedback, setFeedback] = useState(null)

  return (
    <div className="message-feedback">
      <button 
        className={`feedback-btn ${feedback === 'like' ? 'active-like' : ''}`}
        onClick={() => setFeedback('like')}
        title="Boa resposta"
        disabled={feedback !== null}
      >
        👍
      </button>
      <button 
        className={`feedback-btn ${feedback === 'dislike' ? 'active-dislike' : ''}`}
        onClick={() => setFeedback('dislike')}
        title="Resposta ruim"
        disabled={feedback !== null}
      >
        👎
      </button>
      {feedback === 'like' && <span className="feedback-text text-success">✓ Salvo na base de conhecimento</span>}
      {feedback === 'dislike' && <span className="feedback-text text-error">Feedback enviado para revisão</span>}
    </div>
  )
}

function MarkdownText({ text }) {
  // Converte markdown básico para JSX sem dependências extras
  const lines = text.split('\n')
  return (
    <div className="message-text">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i}><strong>{line.slice(2, -2)}</strong></p>
        }
        if (line.startsWith('- ')) {
          return <li key={i}>{renderInline(line.slice(2))}</li>
        }
        if (line.trim() === '') return <br key={i} />
        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function ChatPanel({ messages, isLoading, isMockMode, onSendMessage, onClearChat }) {
  const [input, setInput] = useState('')
  const [showQuick, setShowQuick] = useState(true)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 0) setShowQuick(false)
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    onSendMessage(text)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleQuickPrompt = (text) => {
    onSendMessage(text)
    setShowQuick(false)
  }

  return (
    <aside className="chat-panel">
      {/* Cabeçalho do painel */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="agent-avatar small"><span>AI</span></div>
          <div>
            <div className="chat-agent-name">ProcessSync AI</div>
            <div className="chat-agent-role">Analista de Processos Virtual</div>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="btn-icon" onClick={onClearChat} title="Limpar conversa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        )}
      </div>

      {isMockMode && (
        <div className="demo-banner">
          ⚡ Modo Demonstração — Configure a API Key para IA real
        </div>
      )}

      {/* Área de mensagens */}
      <div className="chat-messages">
        {messages.length === 0 && showQuick && (
          <div className="chat-welcome animate-fade-in-up">
            {/* Banner Institucional Cattalini de Alta Fidelidade */}
            <div className="cattalini-welcome-card">
              <div className="cattalini-card-logo">
                <span className="logo-brand">cattalini</span>
                <span className="logo-sub">Terminais Marítimos</span>
              </div>
              <h2 className="cattalini-card-slogan">
                MOVIMENTANDO LÍQUIDOS COM SEGURANÇA <br />
                <span className="gold-text">POR UM MUNDO SUSTENTÁVEL</span>
              </h2>
            </div>

            <div className="welcome-intro">
              <h3 className="welcome-title">Assistente de Processos</h3>
              <p className="welcome-sub">
                Bem-vindo ao seu co-piloto operacional. Vamos documentar processos AS-IS e propor melhorias TO-BE estruturadas.
              </p>
            </div>

            <div className="quick-prompts">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  className="quick-prompt-btn"
                  onClick={() => handleQuickPrompt(qp.text)}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="qp-icon">{qp.icon}</span>
                  <span className="qp-label-text">{qp.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role} animate-fade-in-up`}
            style={{ animationDelay: '0ms' }}
          >
            {msg.role === 'agent' && (
              <div className="agent-avatar small"><span>AI</span></div>
            )}
            <div className={`message-bubble ${msg.role}-bubble ${msg.isError ? 'error-bubble' : ''}`}>
              <MarkdownText text={msg.text} />
              {msg.role === 'agent' && !msg.isError && (
                <MessageFeedback />
              )}
              <div className="message-time">
                {msg.timestamp?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className="chat-input-area">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva um processo ou pergunte sobre oportunidades de melhorias..."
            rows={3}
            disabled={isLoading}
          />
          <div className="chat-input-actions">
            <span className="input-hint">Enter para enviar · Shift+Enter para nova linha</span>
            <button
              type="submit"
              className="btn btn-primary send-btn"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <span className="spinner" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              )}
              Enviar
            </button>
          </div>
        </form>
      </div>
    </aside>
  )
}
