import './Workspace.css'
import DiagramPanel from './DiagramPanel'
import ImprovementPanel from './ImprovementPanel'
import SAPGuidePanel from './SAPGuidePanel'
import DataPanel from './DataPanel'

const TABS = [
  { id: 'diagram',      icon: '📊', label: 'Diagrama AS-IS' },
  { id: 'improvements', icon: '💡', label: 'Melhorias TO-BE' },
  { id: 'sap',          icon: '🖥️', label: 'Guia SAP' },
  { id: 'data',         icon: '📈', label: 'Analytics' },
]

export default function Workspace({ activeTab, onTabChange, processData, sapGuide }) {
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
        {activeTab === 'sap'          && <SAPGuidePanel    sapGuide={sapGuide} />}
        {activeTab === 'data'         && <DataPanel />}
      </div>
    </section>
  )
}
