import { useState } from 'react'
import './SAPGuidePanel.css'

const DEFAULT_GUIDE = {
  transaction: 'ME21N',
  title: 'Criar Pedido de Compras',
  steps: [
    { step: 1, action: 'Acesse a transação', detail: 'Na barra de comando do SAP, digite ME21N e pressione Enter', field: 'Barra de Comando', tip: 'Ou acesse via menu: Logística > Gestão de Materiais > Compras > Pedido' },
    { step: 2, action: 'Selecione o Tipo de Pedido', detail: 'No campo "Tipo de pedido", selecione NB (Pedido Padrão)', field: 'Tipo de Pedido', tip: 'NB é o tipo mais comum para compras normais de estoque' },
    { step: 3, action: 'Informe o Fornecedor', detail: 'Digite o número do fornecedor ou use F4 para pesquisar', field: 'Fornecedor', tip: 'Use F4 para pesquisar pelo nome ou CNPJ do fornecedor' },
    { step: 4, action: 'Adicione os itens', detail: 'Na aba "Item", informe: Material, Quantidade, Unidade, Preço e Centro', field: 'Grid de Itens', tip: 'O preço pode ser preenchido automaticamente se há contrato vigente' },
    { step: 5, action: 'Defina o prazo de entrega', detail: 'No campo "Data de remessa", informe a data desejada de entrega', field: 'Data de Remessa', tip: 'Considere o lead time do fornecedor cadastrado' },
    { step: 6, action: 'Salve o pedido', detail: 'Clique em Salvar (ícone de disquete) ou pressione Ctrl+S', field: 'Botão Salvar', tip: 'O sistema gerará o número do pedido automaticamente' },
  ],
}

const QUICK_TRANSACTIONS = [
  { code: 'ME51N', name: 'Criar Requisição de Compras', icon: '📋' },
  { code: 'ME21N', name: 'Criar Pedido de Compras', icon: '🛒' },
  { code: 'MIGO',  name: 'Lançamento de Mercadoria', icon: '📦' },
  { code: 'ME2M',  name: 'Pedidos por Material', icon: '🔍' },
  { code: 'MM60',  name: 'Análise de Estoques', icon: '📊' },
]

function SapScreenSimulator({ guide, activeStep, onStepComplete, completedSteps }) {
  return (
    <div className="sap-screen">
      {/* SAP Top Bar simulada */}
      <div className="sap-topbar">
        <div className="sap-topbar-left">
          <div className="sap-logo">SAP</div>
          <div className="sap-transaction-bar">
            <span className="sap-tcode">{guide.transaction}</span>
            <span className="sap-tcode-name">— {guide.title}</span>
          </div>
        </div>
        <div className="sap-topbar-right">
          <div className="sap-icons">
            <span title="Salvar">💾</span>
            <span title="Voltar">⬅</span>
            <span title="Sair">🚪</span>
            <span title="Ajuda">❓</span>
          </div>
        </div>
      </div>

      {/* Steps interativos */}
      <div className="sap-steps-container">
        <div className="sap-steps-sidebar">
          {guide.steps.map((s) => {
            const isDone = completedSteps.includes(s.step)
            const isActive = activeStep === s.step - 1
            return (
              <div
                key={s.step}
                className={`sap-step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              >
                <div className="sap-step-circle">
                  {isDone ? '✓' : s.step}
                </div>
                <div className="sap-step-name">{s.action}</div>
              </div>
            )
          })}
        </div>

        <div className="sap-step-detail">
          {guide.steps[activeStep] && (() => {
            const s = guide.steps[activeStep]
            const isDone = completedSteps.includes(s.step)
            return (
              <div className="sap-detail-card animate-fade-in">
                <div className="sap-detail-step-num">Passo {s.step} de {guide.steps.length}</div>
                <h3 className="sap-detail-action">{s.action}</h3>

                <div className="sap-field-highlight">
                  <span className="sap-field-label">Campo SAP:</span>
                  <span className="sap-field-name">{s.field}</span>
                </div>

                <p className="sap-detail-text">{s.detail}</p>

                {s.tip && (
                  <div className="sap-tip">
                    <span>💡</span>
                    <span>{s.tip}</span>
                  </div>
                )}

                <button
                  className={`btn ${isDone ? 'btn-ghost' : 'btn-primary'} sap-complete-btn`}
                  onClick={() => onStepComplete(s.step)}
                  disabled={isDone}
                >
                  {isDone ? '✓ Concluído' : 'Marcar como concluído →'}
                </button>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default function SAPGuidePanel({ sapGuide }) {
  const guide = sapGuide || DEFAULT_GUIDE
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  const handleComplete = (stepNum) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps(prev => [...prev, stepNum])
    }
    if (activeStep < guide.steps.length - 1) {
      setActiveStep(prev => prev + 1)
    }
  }

  const progress = Math.round((completedSteps.length / guide.steps.length) * 100)

  return (
    <div className="sap-guide-panel">
      <div className="panel-header">
        <h2 className="panel-title">🖥️ Guia SAP Interativo</h2>
        <p className="panel-subtitle">
          {guide.transaction} — {guide.title} • Siga os passos abaixo
        </p>
      </div>

      {/* Quick transactions */}
      <div className="sap-quick-tx">
        {QUICK_TRANSACTIONS.map(tx => (
          <button key={tx.code} className={`sap-tx-btn ${guide.transaction === tx.code ? 'active' : ''}`} title={tx.name}>
            <span>{tx.icon}</span>
            <span className="sap-tx-code">{tx.code}</span>
          </button>
        ))}
      </div>

      {/* Progresso */}
      <div className="sap-progress">
        <div className="sap-progress-label">
          <span>Progresso do treinamento</span>
          <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{progress}%</span>
        </div>
        <div className="roi-bar-track">
          <div className="roi-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <SapScreenSimulator
        guide={guide}
        activeStep={activeStep}
        onStepComplete={handleComplete}
        completedSteps={completedSteps}
      />
    </div>
  )
}
