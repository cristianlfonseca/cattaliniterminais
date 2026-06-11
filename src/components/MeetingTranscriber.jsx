import { useState, useEffect, useRef } from 'react'
import './MeetingTranscriber.css'

export default function MeetingTranscriber({ isOpen, onClose, onInsertText, onSendText }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const recognitionRef = useRef(null)
  const accumulatedTextRef = useRef('') // Guarda todo o texto finalizado ao longo de sessões/pausas

  // Inicializa o SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setErrorMsg('A API de reconhecimento de fala não é suportada neste navegador. Use o Google Chrome ou o Microsoft Edge.')
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'pt-BR'

    rec.onstart = () => {
      setIsRecording(true)
      setIsPaused(false)
    }

    rec.onerror = (e) => {
      console.error('Erro no reconhecimento de fala:', e)
      if (e.error === 'not-allowed') {
        setErrorMsg('Permissão de microfone negada. Permita o acesso ao microfone nas configurações do navegador.')
      } else {
        setErrorMsg(`Erro de gravação: ${e.error}`)
      }
      setIsRecording(false)
      setIsPaused(false)
    }

    rec.onend = () => {
      // Se não pausamos/paramos intencionalmente, reiniciamos para manter a gravação contínua em reuniões longas
      if (isRecording && !isPaused) {
        try {
          recognitionRef.current?.start()
        } catch (err) {
          console.warn('Erro ao reiniciar gravação:', err)
        }
      }
    }

    rec.onresult = (event) => {
      let finalStr = ''
      let interimStr = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i]
        if (result.isFinal) {
          finalStr += result[0].transcript + ' '
        } else {
          interimStr += result[0].transcript
        }
      }

      if (finalStr) {
        accumulatedTextRef.current += finalStr
        setTranscript(accumulatedTextRef.current)
      }
      setInterimText(interimStr)
    }

    recognitionRef.current = rec

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording, isPaused])

  // Desliga o gravador caso o drawer seja fechado
  useEffect(() => {
    if (!isOpen) {
      handleStop()
    }
  }, [isOpen])

  const handleStart = () => {
    setErrorMsg('')
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error(e)
    }
  }

  const handlePause = () => {
    if (!recognitionRef.current) return
    setIsPaused(true)
    recognitionRef.current.stop()
  }

  const handleResume = () => {
    if (!recognitionRef.current) return
    setIsPaused(false)
    setIsRecording(true)
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error(e)
    }
  }

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setIsPaused(false)
    setInterimText('')
  }

  const handleClear = () => {
    accumulatedTextRef.current = ''
    setTranscript('')
    setInterimText('')
  }

  const handleUseText = () => {
    const fullText = (transcript + ' ' + interimText).trim()
    if (fullText) {
      onInsertText(fullText)
      onClose()
    }
  }

  const handleSendDirectly = () => {
    const fullText = (transcript + ' ' + interimText).trim()
    if (fullText) {
      onSendText(fullText)
      onClose()
    }
  }

  if (!isOpen) return null

  const displayText = (transcript + (interimText ? ' ' + interimText : '')).trim()

  return (
    <div className="meeting-transcriber-drawer animate-fade-in-up">
      <div className="transcriber-header">
        <div className="transcriber-title">
          <span className="transcriber-icon">🎙️</span>
          <div>
            <h3>Gravar e Transcrever Reunião</h3>
            <p>Grave a conversa e use a transcrição para apoiar o mapeamento</p>
          </div>
        </div>
        <button className="btn-close-drawer" onClick={onClose} title="Fechar gravador">
          ✕
        </button>
      </div>

      <div className="transcriber-body">
        {errorMsg && (
          <div className="transcriber-error animate-fade-in">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <div className="recording-status-area">
          <div className="status-indicator">
            {isRecording && !isPaused ? (
              <>
                <span className="pulse-dot active" />
                <span className="status-label">Gravando Reunião...</span>
              </>
            ) : isPaused ? (
              <>
                <span className="pulse-dot paused" />
                <span className="status-label text-warning">Gravação Pausada</span>
              </>
            ) : (
              <>
                <span className="pulse-dot" />
                <span className="status-label text-muted">Pronto para gravar</span>
              </>
            )}
          </div>

          {isRecording && !isPaused && (
            <div className="audio-wave">
              <span className="wave-bar bar-1"></span>
              <span className="wave-bar bar-2"></span>
              <span className="wave-bar bar-3"></span>
              <span className="wave-bar bar-4"></span>
              <span className="wave-bar bar-5"></span>
            </div>
          )}
        </div>

        <div className="transcript-box-wrapper">
          <textarea
            className="transcript-textarea"
            value={displayText}
            onChange={(e) => {
              accumulatedTextRef.current = e.target.value
              setTranscript(e.target.value)
              setInterimText('')
            }}
            placeholder="A transcrição da reunião aparecerá aqui em tempo real à medida que as pessoas falam. Você também pode digitar ou editar este texto a qualquer momento..."
          />
        </div>

        <div className="transcriber-actions">
          <div className="recording-controls">
            {!isRecording && !isPaused ? (
              <button type="button" className="btn btn-primary start-rec-btn" onClick={handleStart}>
                🔴 Iniciar Gravação
              </button>
            ) : isRecording && !isPaused ? (
              <button type="button" className="btn btn-ghost pause-rec-btn" onClick={handlePause}>
                ⏸️ Pausar
              </button>
            ) : (
              <button type="button" className="btn btn-primary resume-rec-btn" onClick={handleResume}>
                ▶️ Retomar
              </button>
            )}

            {(isRecording || isPaused || displayText) && (
              <button type="button" className="btn btn-ghost stop-rec-btn" onClick={handleStop} disabled={!isRecording && !isPaused}>
                ⏹️ Parar
              </button>
            )}

            {displayText && (
              <button type="button" className="btn btn-ghost clear-rec-btn" onClick={handleClear} title="Limpar transcrição">
                🗑️ Limpar
              </button>
            )}
          </div>

          <div className="usage-controls">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleUseText}
              disabled={!displayText}
              title="Copia a transcrição para a caixa de digitação principal do chat"
            >
              ✍️ Copiar para o Rascunho
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSendDirectly}
              disabled={!displayText}
              title="Envia a transcrição diretamente como uma nova mensagem no chat"
            >
              🚀 Enviar para IA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
