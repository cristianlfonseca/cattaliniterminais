import './Workspace.css'
import DiagramPanel from './DiagramPanel'
import ImprovementPanel from './ImprovementPanel'

const TABS = [
  { id: 'diagram',      icon: '📊', label: 'Diagrama AS-IS' },
  { id: 'improvements', icon: '💡', label: 'Melhorias TO-BE' },
]

export default function Workspace({ activeTab, onTabChange, processData }) {
  return (
    <section className="workspace">
      {/* Barra de abas */}
      <div className="workspace-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`workspace-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.id === activeTab && <div className="tab-indicator" />}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="workspace-content">
        {activeTab === 'diagram'      && <DiagramPanel     processData={processData} />}
        {activeTab === 'improvements' && <ImprovementPanel processData={processData} />}
      </div>
    </section>
  )
}
