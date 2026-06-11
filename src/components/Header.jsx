import './Header.css'

const CattaliniLogoMark = () => (
  <svg className="cattalini-logo-svg" width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Moldura externa azul navy com cantos arredondados */}
    <rect x="10" y="25" width="80" height="50" rx="12" fill="var(--neon-blue)" />
    {/* Elipse dourada interna */}
    <ellipse cx="50" cy="50" rx="26" ry="16" fill="#F1C930" />
    {/* Círculo/Elipse azul no centro */}
    <ellipse cx="50" cy="50" rx="14" ry="9" fill="var(--neon-blue)" />
  </svg>
)

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
)

export default function Header({ theme, onToggleTheme, onLogout }) {
  return (
    <header className="header">
      {/* Logo & Marca Corporativa da Cattalini */}
      <div className="header-brand">
        <div className="header-logo-container">
          <CattaliniLogoMark />
          <span className="cattalini-logo-text">cattalini</span>
        </div>
        <div className="brand-divider" />
        <div className="header-title-group">
          <h1 className="header-title">
            ProcessSync <span className="text-gradient">AI</span>
          </h1>
          <p className="header-subtitle">Operações Inteligentes</p>
        </div>
      </div>

      {/* Menu Corporativo Discreto */}
      <nav className="header-nav">
        <span className="nav-link active">Mapeamento</span>
      </nav>

      {/* Ações e Status da API */}
      <div className="header-actions">
        {/* Botão Seletor de Tema (Light/Dark) */}
        <button 
          className="btn-theme-toggle" 
          onClick={onToggleTheme} 
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          <span className="theme-toggle-label">{theme === 'light' ? 'Escuro' : 'Claro'}</span>
        </button>

        {/* Botão Sair (Logout) */}
        <button 
          className="btn-logout" 
          onClick={onLogout} 
          title="Sair da Plataforma"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </header>
  )
}
