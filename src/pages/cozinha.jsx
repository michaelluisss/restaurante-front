import React from "react";
import { Link } from "react-router-dom";
import "./cozinha.css";
import longout from "../icons/longout.png";
import andamento from "../icons/andamento.png";
import verificado from "../icons/verificado.png"

const Cozinha = () => {
  return (
    <div className="cozinha-page">
      <div className="cozinha-container">
        <div className="cozinha-top">
          <header className="cozinha-header">
            <div className="cozinha-brand">
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
          <div>
            <Link to="/mesas" className="longout">
              <h3 className="longout" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                Sair
                <img
                  src={longout}
                  alt="Sair"
                  style={{ width: "28px", height: "auto" }}
                />
              </h3>
            </Link>
          </div>
        </div>

        <h1 className="cozinha-title">COZINHA</h1>

        <div className="cozinha-content">
          <div  className="cozinha-pedidos">
            <img className="icons" src={andamento}></img>
             PEDIDOS ABERTOS
          </div>
          <div  className="cozinha-pedidos">  
            <img className="icons" src={verificado}></img>
           PEDIDOS FEITOS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cozinha;