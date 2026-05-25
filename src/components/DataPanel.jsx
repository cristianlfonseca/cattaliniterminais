import './DataPanel.css'

// Dados simulados de analytics de compras
const KPI_DATA = [
  { label: 'Lead Time Médio', value: '14,2', unit: 'dias', trend: '+2,1', trendUp: false, color: 'var(--neon-red)', icon: '⏱️' },
  { label: 'Pedidos no Prazo', value: '67%', unit: '', trend: '-8%', trendUp: false, color: 'var(--neon-amber)', icon: '✅' },
  { label: 'Fornecedores Ativos', value: '142', unit: '', trend: '+12', trendUp: true, color: 'var(--neon-cyan)', icon: '🤝' },
  { label: 'Economia Negociada', value: 'R$48k', unit: '/mês', trend: '+15%', trendUp: true, color: 'var(--neon-green)', icon: '💰' },
]

const MONTHLY_DATA = [
  { month: 'Jan', orders: 42, onTime: 28 },
  { month: 'Fev', orders: 38, onTime: 22 },
  { month: 'Mar', orders: 55, onTime: 38 },
  { month: 'Abr', orders: 47, onTime: 35 },
  { month: 'Mai', orders: 63, onTime: 45 },
  { month: 'Jun', orders: 58, onTime: 39 },
]

const SUPPLIER_DATA = [
  { name: 'Fornecedor A', value: 35, color: 'var(--neon-cyan)' },
  { name: 'Fornecedor B', value: 25, color: 'var(--neon-purple)' },
  { name: 'Fornecedor C', value: 20, color: 'var(--neon-green)' },
  { name: 'Outros',       value: 20, color: 'var(--neon-amber)' },
]

const PENDING_ITEMS = [
  { type: 'Aprovação pendente',        count: 8,  urgency: 'high' },
  { type: 'Pedidos em atraso',         count: 14, urgency: 'high' },
  { type: 'NF aguardando lançamento',  count: 23, urgency: 'medium' },
  { type: 'Cotações a responder',      count: 5,  urgency: 'low' },
]

const maxOrders = Math.max(...MONTHLY_DATA.map(d => d.orders))

function BarChart() {
  return (
    <div className="bar-chart">
      {MONTHLY_DATA.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-group">
            <div
              className="bar total-bar"
              style={{ height: `${(d.orders / maxOrders) * 100}%` }}
              title={`Total: ${d.orders}`}
            />
            <div
              className="bar ontime-bar"
              style={{ height: `${(d.onTime / maxOrders) * 100}%` }}
              title={`No prazo: ${d.onTime}`}
            />
          </div>
          <div className="bar-label">{d.month}</div>
        </div>
      ))}
    </div>
  )
}

function DonutChart() {
  let offset = 0
  const radius = 45
  const circumference = 2 * Math.PI * radius

  return (
    <div className="donut-wrapper">
      <svg viewBox="0 0 120 120" className="donut-svg">
        {SUPPLIER_DATA.map((s, i) => {
          const slice = (s.value / 100) * circumference
          const gap = 2
          const el = (
            <circle
              key={i}
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={`${slice - gap} ${circumference - slice + gap}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
              transform="rotate(-90 60 60)"
            />
          )
          offset += slice
          return el
        })}
        <text x="60" y="56" textAnchor="middle" fill="white" fontSize="10" fontFamily="Montserrat" fontWeight="700">Total</text>
        <text x="60" y="70" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="Inter">pedidos</text>
      </svg>
      <div className="donut-legend">
        {SUPPLIER_DATA.map((s, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-dot" style={{ background: s.color }} />
            <span>{s.name}</span>
            <span className="donut-pct" style={{ color: s.color }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DataPanel() {
  return (
    <div className="data-panel">
      <div className="panel-header">
        <h2 className="panel-title">📈 Analytics de Compras</h2>
        <p className="panel-subtitle">Indicadores de desempenho do setor • Dados simulados para demonstração</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {KPI_DATA.map((kpi, i) => (
          <div key={i} className={`kpi-card animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="kpi-top">
              <span className="kpi-icon">{kpi.icon}</span>
              <span className={`kpi-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
              </span>
            </div>
            <div className="kpi-value" style={{ color: kpi.color }}>
              {kpi.value}<span className="kpi-unit">{kpi.unit}</span>
            </div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card glass-card">
          <div className="chart-title">Pedidos x Prazo por Mês</div>
          <BarChart />
          <div className="bar-legend">
            <span><span className="bar-legend-dot total" />Total</span>
            <span><span className="bar-legend-dot ontime" />No prazo</span>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="chart-title">Volume por Fornecedor</div>
          <DonutChart />
        </div>
      </div>

      {/* Pendências */}
      <div className="glass-card pending-card">
        <div className="chart-title">⚡ Pendências Críticas</div>
        <div className="pending-list">
          {PENDING_ITEMS.map((item, i) => (
            <div key={i} className="pending-item">
              <div className="pending-info">
                <span className={`badge badge-${item.urgency === 'high' ? 'red' : item.urgency === 'medium' ? 'amber' : 'cyan'}`}>
                  {item.urgency === 'high' ? 'Urgente' : item.urgency === 'medium' ? 'Atenção' : 'Normal'}
                </span>
                <span className="pending-label">{item.type}</span>
              </div>
              <span className="pending-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
