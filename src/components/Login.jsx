import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simula tempo de rede e valida credenciais mockadas
    setTimeout(() => {
      if (email === 'admin' && password === 'cattalini') {
        onLogin();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in-up">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-brand">cattalini</span>
            <span className="logo-sub">Terminais Marítimos</span>
          </div>
          <h2 className="login-title">ProcessSync AI</h2>
          <p className="login-subtitle">Acesso restrito a colaboradores autorizados.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              Credenciais inválidas. Use admin / cattalini para o ambiente de demonstração.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Usuário Corporativo</label>
            <input
              type="text"
              id="email"
              placeholder="Digite seu usuário (ex: admin)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha (ex: cattalini)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading || !email || !password}>
            {isLoading ? <span className="spinner-small"></span> : 'Acessar Plataforma'}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Cattalini Terminais Marítimos.</p>
          <p>Uso exclusivo e confidencial.</p>
        </div>
      </div>
    </div>
  );
}
