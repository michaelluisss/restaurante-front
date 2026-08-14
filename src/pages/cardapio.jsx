import { useEffect, useState } from "react";
import axios from "axios";
import "./cardapio.css";
import longout from "../icons/longout.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Cardapio = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const mesaId = searchParams.get("mesaId");


  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3331/cardapio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data || []);
      } catch (err) {
        console.error("Erro ao carregar o cardápio:", err);
        setError("Não foi possível carregar o cardápio.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardapio();
  }, []);

  const handleIncrement = (itemId, itemName) => {
    const itemKey = `${itemId}`;
    setItemQuantities((prev) => ({
      ...prev,
      [itemKey]: (prev[itemKey] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId, itemName) => {
    const itemKey = `${itemId}`;
    setItemQuantities((prev) => ({
      ...prev,
      [itemKey]: Math.max((prev[itemKey] || 0) - 1, 0),
    }));
  };

  // Organizar itens por categoria
  const groupedItems = items.reduce((acc, item) => {
    const categoria = item.categoria || item.category || "Outros";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {});

  return (
    <div className="cardapio-page">
      <div className="cardapio-container">
        <div className="cardapio-top">
          <header className="cardapio-header">
            <div className="cardapio-brand">
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

        <h1 className="cardapio-title">CARDÁPIO</h1>

        <div className="cardapio-list">
          {loading && (
            <div className="cardapio-message">Carregando itens...</div>
          )}
          {error && <div className="cardapio-error">{error}</div>}
          {!loading && !error && Object.keys(groupedItems).length === 0 && (
            <div className="cardapio-message">
              Nenhum item encontrado no cardápio.
            </div>
          )}

          {Object.entries(groupedItems)
            .filter(([categoria]) => categoria.toLowerCase() !== "sair")
            .map(([categoria, categoriaItems]) => (
            <div key={categoria} className="categoria-section">
              <h2 className="categoria-title">{categoria}</h2>
              <div className="categoria-items">
                {categoriaItems.map((item, index) => {
                  const nome = item.nome || "Nome do prato";
                  const descricao = item.detalhes || "Descrição do prato";
                  const disponivel = item.disponivel;
                  const valor = `R$ ${parseFloat(item.valor).toFixed(2)}`;
                  const itemKey = `${item.id}`;

                  return (
                    <article className="cardapio-item" key={`${item.id}-${index}`}>
                      <div className="item-top">
                        <span className="item-name">{nome}</span>
                        <span className="item-price">{valor}</span>
                        <div className="quantity-controls">
                          <button 
                            className="btn-decrement"
                            onClick={() => handleDecrement(item.id, nome)}
                          >
                            −
                          </button>
                          <span className="order-badge">{itemQuantities[itemKey] || 0}</span>
                          <button 
                            className="btn-increment"
                            onClick={() => handleIncrement(item.id, nome)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="item-description">{descricao}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
          
        </div>
        <footer className="cardapio-footer">
          <button 
            className="btn-view-orders" 
            type="button"
            onClick={() => {
              const params = new URLSearchParams({ mesaId, itemQuantities: JSON.stringify(itemQuantities) });
              navigate(`/pedidos?${params.toString()}`);
            }}
          >
            VER PEDIDOS
            <span className="order-badge">
              {Object.values(itemQuantities).reduce((a, b) => a + b, 0)}
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Cardapio;
