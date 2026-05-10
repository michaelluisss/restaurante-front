import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo) {
      setToken(tokenSalvo);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Tentando logar com ID:', id, 'Senha:', senha);

    try {
      const resposta = await axios.post('http://localhost:3331/login', {
        id,
        senha,
      });

      const tokenRetornado = resposta.data?.token;
      if (tokenRetornado) {
        localStorage.setItem('token', tokenRetornado);
        setToken(tokenRetornado);
      }

      if (resposta.data?.cargo === 'garcom') {
        navigate('/mesas');
      } else {
        navigate('/contact');
      }
    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <header className="login-header">
          <div className="chef-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
              <line x1="6" y1="17" x2="18" y2="17"></line>
            </svg>
          </div>
        </header>

        <h1 className="login-title">SEJA BEM-VINDO</h1>

      
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="id">ID:</label>
            <input 
              type="text" 
              id="id" 
              placeholder="Digite seu id..." 
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">SENHA:</label>
            <input 
              type="password" 
              id="senha" 
              placeholder="Digite sua senha..." 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-entrar">
            ENTRAR
          </button>
        </form>

      </div>
    </div>
  );
}

export default App;