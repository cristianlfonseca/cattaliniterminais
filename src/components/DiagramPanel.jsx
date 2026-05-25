import './DiagramPanel.css'

const STEP_COLORS = {
  start:    { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: '#10B981' },
  end:      { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: '#10B981' },
  process:  { bg: 'rgba(111,156,235,0.08)', border: 'rgba(111,156,235,0.3)', color: '#6F9CEB' },
  decision: { bg: 'rgba(241,201,48,0.08)', border: 'rgba(241,201,48,0.35)', color: '#F1C930' },
  system:   { bg: 'rgba(45,99,162,0.08)',  border: 'rgba(45,99,162,0.35)',  color: '#2D63A2' },
}

const SYSTEM_ICONS = {
  SAP:    '🏢', Excel: '📊', Email: '📧',
  Manual: '✋', Sistema: '⚙️',
}

function StepNode({ step, index }) {
  const style = STEP_COLORS[step.type] || STEP_COLORS.process

  return (
    <div
      className={`diagram-step animate-fade-in-up`}
      style={{
        animationDelay: `${index * 80}ms`,
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: `0 0 12px ${style.border}`,
      }}
    >
      <div className="step-header">
        <span className="step-num" style={{ color: style.color }}>#{index + 1}</span>
        <span className="step-system-icon">{SYSTEM_ICONS[step.system] || '⚙️'}</span>
        <span className="step-system-tag" style={{ color: style.color }}>{step.system}</span>
      </div>
      <div className="step-label">{step.label}</div>
      {step.responsible && (
        <div className="step-meta">
          <span>👤 {step.responsible}</span>
          {step.duration && <span>⏱ {step.duration}</span>}
        </div>
      )}
      {step.pain && (
        <div className="step-pain">
          <span>⚠️</span> {step.pain}
        </div>
      )}
    </div>
  )
}

function Arrow({ hasPain }) {
  return (
    <div className={`diagram-arrow ${hasPain ? 'pain-arrow' : ''}`}>
      <div className="arrow-line" />
      <div className="arrow-head">▼</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="panel-empty animate-fade-in">
      <div className="empty-icon">📊</div>
      <h3 className="empty-title">Diagrama AS-IS</h3>
      <p className="empty-desc">
        Descreva um processo no chat ao lado e eu vou gerar o fluxograma visual automaticamente aqui.
      </p>
      <div className="empty-hint-list">
        <span className="badge badge-cyan">Requisição de Compras</span>
        <span className="badge badge-cyan">Aprovação de Fornecedores</span>
        <span className="badge badge-cyan">Recebimento Fiscal</span>
      </div>
    </div>
  )
}

export default function DiagramPanel({ processData }) {
  if (!processData) return <EmptyState />

  const { steps } = processData

  return (
    <div className="diagram-panel">
      <div className="panel-header">
        <h2 className="panel-title">📊 Fluxograma AS-IS</h2>
        <p className="panel-subtitle">
          Processo mapeado • {steps.length} etapas • {steps.filter(s => s.pain).length} gargalos identificados
        </p>
      </div>

      {/* Legenda */}
      <div className="diagram-legend">
        {Object.entries({ 'Início/Fim': 'start', 'Atividade': 'process', 'Decisão': 'decision' }).map(([label, type]) => (
          <div key={type} className="legend-item">
            <div className="legend-dot" style={{ background: STEP_COLORS[type].color, boxShadow: `0 0 6px ${STEP_COLORS[type].color}` }} />
            <span>{label}</span>
          </div>
        ))}
        <div className="legend-item">
          <span style={{ color: '#FF6B6B' }}>⚠️</span>
          <span>Gargalo</span>
        </div>
      </div>

      {/* Diagrama de fluxo */}
      <div className="diagram-flow">
        {steps.map((step, i) => (
          <div key={step.id}>
            <StepNode step={step} index={i} />
            {i < steps.length - 1 && <Arrow hasPain={!!steps[i + 1]?.pain} />}
          </div>
        ))}
      </div>
    </div>
  )
}
