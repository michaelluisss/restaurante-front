import { useEffect, useState } from "react";
import axios from "axios";
import "./mesas.css";
import longout from "../icons/longout.png";
import { Link } from "react-router-dom";
import styled from "styled-components";


const Mesas = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderCount, setOrderCount] = useState(0);


  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3331/mesas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data || []);
      } catch (err) {
        console.error("Erro ao carregar as mesas:", err);
        setError("Não foi possível carregar as mesas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);
  
  
    const tableColorStatus = (status) => {
        switch (status) {
            case 'livre': return ' #4caf50';
            case 'fechando':  return '#ff9800';
            case 'ocupada':    return '#f44336';
            default:        return '#9e9e9e';
    }
};

  return (
    <div className="mesas-page">
      <div className="mesas-container">
        <div className="mesas-top">
          <header className="mesas-header">
            <div className="mesas-brand">
              <div className="brand-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff8c00"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" y1="17" x2="18" y2="17" />
                </svg>
              </div>
            </div>
          </header>
          <div >
            <Link to="/" className="longout" >
            <h3 className="longout" style={{ display: "flex", alignItems: "center", gap: "10px" }}>Sair<img
                src={longout}
                alt="Descrição da imagem"
                style={{ width: "28px",
                         height: "auto",}}
              />
            </h3>
            
              
            </Link>
          </div>
        </div>

        <h1 className="mesas-title">SELECIONE A MESA</h1>

        <div className="mesas-list">
          {loading && (
            <div className="mesas-message">Carregando itens...</div>
          )}
          {error && <div className="mesas-error">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="mesas-message">
              Nenhuma mesa encontrada.
            </div>
          )}

          
        </div>
        <footer className="mesas-footer">
          {items.map(item => (
            <button key={item.id} className="mesas-item"
             style={{backgroundColor: tableColorStatus(item.status)}}
             onClick={() => window.location.href = `/cardapio?mesaId=${item.id}`}
             >
              <h1>MESA {item.numero}</h1>
              <h1>{item.status}</h1>
            </button>
          ))}
        </footer>
        
      </div>
    </div>
  );
};

export default Mesas;
