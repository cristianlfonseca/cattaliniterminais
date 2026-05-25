import { useState, useCallback, useEffect } from 'react'
import { geminiService } from './services/geminiService'
import Header from './components/Header'
import ChatPanel from './components/ChatPanel'
import Login from './components/Login'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMockMode, setIsMockMode] = useState(false)
  const [processData, setProcessData] = useState(null)
  const [sapGuide, setSapGuide] = useState(null)
  const [activeTab, setActiveTab] = useState('diagram')

  // Autenticação mockada com sessionStorage para não perder no reload
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('auth') === 'true'
  })

  // Gerenciamento de Tema (Light por padrão corporativo)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const handleSendMessage = useCallback(async (text) => {
    const userMsg = { role: 'user', text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const result = await geminiService.sendMessage(text)
      setIsMockMode(geminiService.isMockMode)

      const agentMsg = { role: 'agent', text: result.message, timestamp: new Date() }
      setMessages(prev => [...prev, agentMsg])

      if (result.processData) setProcessData(result.processData)
      if (result.sapGuide) setSapGuide(result.sapGuide)
      if (result.activeTab) setActiveTab(result.activeTab)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'Ocorreu um erro inesperado. Tente novamente.',
        timestamp: new Date(),
        isError: true,
      }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleClearChat = useCallback(() => {
    geminiService.clearHistory()
    setMessages([])
    setProcessData(null)
    setSapGuide(null)
    setActiveTab('diagram')
    setIsMockMode(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem('auth', 'true')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <Header 
        isMockMode={isMockMode} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="app-main">
        {/* Sidebar Lateral de Histórico */}
        <aside className="app-sidebar">
          <div className="sidebar-header">
            <button className="btn-new-map" onClick={handleClearChat}>
              <span>➕</span> Novo Mapeamento
            </button>
          </div>
          
          <div className="sidebar-menu">
            <div className="menu-section-title">Mapeamentos Recentes</div>
            <div className="history-list">
              <button 
                className={`history-item ${messages.length > 0 ? 'active' : ''}`}
                onClick={() => handleSendMessage('Mapear processo de requisição de compras da empresa.')}
              >
                <span className="history-icon">📝</span>
                <span className="history-text">Mapeamento de Compras</span>
              </button>
              
              <button 
                className="history-item"
                onClick={() => handleSendMessage('Com base no processo de compras atual, quero que você proponha melhorias TO-BE.')}
              >
                <span className="history-icon">💡</span>
                <span className="history-text">Otimizações e ROI TO-BE</span>
              </button>
            </div>
          </div>
          
          <div className="sidebar-footer">
            <span className="sidebar-footer-brand">ProcessSync AI</span>
            <span>Cattalini Terminais Marítimos</span>
          </div>
        </aside>

        {/* Chat Principal */}
        <div className="chat-container">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            isMockMode={isMockMode}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
          />
        </div>
      </main>
    </div>
  )
}

export default App
