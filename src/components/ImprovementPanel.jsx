import { useState } from 'react'
import './ImprovementPanel.css'

const IMPACT_CONFIG = {
  high:   { label: 'Alto Impacto',   badgeClass: 'badge-green',  bar: 95 },
  medium: { label: 'Médio Impacto',  badgeClass: 'badge-amber',  bar: 60 },
  low:    { label: 'Baixo Impacto',  badgeClass: 'badge-purple', bar: 30 },
}

function ImprovementCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = IMPACT_CONFIG[item.impact] || IMPACT_CONFIG.medium
  const totalHours = item.roiHours || 0
  const monthlyValue = Math.round((totalHours * 85)) // R$85/h estimado

  return (
    <div
      className={`improvement-card animate-fade-in-up ${expanded ? 'expanded' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="improvement-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="improvement-number">{index + 1}</div>
        <div className="improvement-info">
          <div className="improvement-title">{item.title}</div>
          <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
        </div>
        <div className="improvement-roi-preview">
          <div className="roi-hours">{totalHours}h</div>
          <div className="roi-label">economizadas/mês</div>
        </div>
        <button className="improvement-toggle">
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div className="improvement-body animate-fade-in">
          <div className="improvement-comparison">
            <div className="comparison-col as-is">
              <div className="comparison-label">
                <span className="badge badge-red" style={{ fontSize: '0.62rem' }}>AS-IS</span>
                Situação Atual
              </div>
              <p className="comparison-text">{item.from}</p>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="comparison-col to-be">
              <div className="comparison-label">
                <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>TO-BE</span>
                Proposta
              </div>
              <p className="comparison-text">{item.to}</p>
            </div>
          </div>

          {/* ROI Visual */}
          <div className="roi-block">
            <div className="roi-bar-wrapper">
              <div className="roi-bar-label">Impacto estimado</div>
              <div className="roi-bar-track">
                <div className="roi-bar-fill" style={{ width: `${cfg.bar}%` }} />
              </div>
            </div>
            <div className="roi-numbers">
              <div className="roi-number">
                <div className="roi-num-value text-gradient-green">{totalHours}h</div>
                <div className="roi-num-label">Economia / mês</div>
              </div>
              <div className="roi-number">
                <div className="roi-num-value text-gradient">R$ {monthlyValue.toLocaleString('pt-BR')}</div>
                <div className="roi-num-label">Valor estimado / mês</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="panel-empty animate-fade-in">
      <div className="empty-icon">💡</div>
      <h3 className="empty-title">Análise TO-BE</h3>
      <p className="empty-desc">
        Após mapear o processo AS-IS no chat, peça para o agente identificar gargalos e propor melhorias com ROI calculado.
      </p>
      <div className="empty-hint-list">
        <span className="badge badge-green">Automação de Fluxo</span>
        <span className="badge badge-amber">Eliminação de Retrabalho</span>
        <span className="badge badge-purple">Integração SAP</span>
      </div>
    </div>
  )
}

export default function ImprovementPanel({ processData }) {
  if (!processData?.improvements?.length) return <EmptyState />

  const { improvements } = processData
  const totalHours = improvements.reduce((sum, i) => sum + (i.roiHours || 0), 0)
  const totalValue = Math.round(totalHours * 85)

  return (
    <div className="improvement-panel">
      <div className="panel-header">
        <h2 className="panel-title">💡 Plano TO-BE & ROI</h2>
        <p className="panel-subtitle">{improvements.length} melhorias identificadas • Clique em cada uma para expandir</p>
      </div>

      {/* Summary cards */}
      <div className="roi-summary">
        <div className="roi-summary-card">
          <div className="roi-s-value text-gradient-green">{totalHours}h</div>
          <div className="roi-s-label">Total economizado / mês</div>
        </div>
        <div className="roi-summary-card">
          <div className="roi-s-value text-gradient">R$ {totalValue.toLocaleString('pt-BR')}</div>
          <div className="roi-s-label">Valor gerado / mês (est.)</div>
        </div>
        <div className="roi-summary-card">
          <div className="roi-s-value" style={{ color: 'var(--neon-amber)' }}>{improvements.filter(i => i.impact === 'high').length}</div>
          <div className="roi-s-label">Melhorias de alto impacto</div>
        </div>
      </div>

      {/* Cards de melhoria */}
      <div className="improvements-list">
        {improvements.map((item, i) => (
          <ImprovementCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
