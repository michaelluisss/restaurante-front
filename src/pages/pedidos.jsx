import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./pedidos.css";
import longout from "../icons/longout.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Pedidos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const [confirmando, setConfirmando] = useState(false);
  const mesaId = searchParams.get("mesaId");

  useEffect(() => {
    const quantities = searchParams.get("itemQuantities");
    
    // Validar mesaId
    if (!mesaId) {
      setError("Mesa ID não encontrado. Volte ao cardápio e selecione uma mesa.");
      setLoading(false);
      return;
    }
    
    if (quantities) {
      try {
        setItemQuantities(JSON.parse(quantities));
      } catch (err) {
        console.error("Erro ao parsear quantidades:", err);
      }
    }
  }, [mesaId]);

  // Carregar cardápio para obter nomes e preços
  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3331/cardapio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCardapio(response.data || []);
      } catch (erro) {
        console.error("Erro ao carregar cardápio:", erro);
      } finally {
        setLoading(false);
      }
    };

    fetchCardapio();
  }, []);

  // Otimização: Transforma o array do cardápio em um objeto de busca rápida O(1)
  // Isso evita percorrer a lista inteira (.find) para cada item renderizado
  const cardapioLookup = useMemo(() => {
    return cardapio.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [cardapio]);

  // Função auxiliar para obter item do cardápio pelo ID
  const getItemInfo = (itemId) => {
    return cardapioLookup[parseInt(itemId)];
  };

  const handleConfirmOrder = async () => {
    if (totalItems === 0) {
      alert("Selecione pelo menos um item para confirmar o pedido.");
      return;
    }

    setConfirmando(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setConfirmando(false);
        return;
      }

      if (!mesaId) {
        setError("Mesa ID não encontrado.");
        setConfirmando(false);
        return;
      }

      // 1. Criar o pedido
      console.log("Criando pedido...", { mesa_id: parseInt(mesaId) });
      const pedidoResponse = await axios.post(
        "http://localhost:3331/pedidos",
        {
          mesa_id: parseInt(mesaId),
          status: "aberto",
          data_abertura: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✓ Pedido criado com sucesso:", pedidoResponse.data);


      const pedidoId = pedidoResponse.data.id;
      // 2. Criar itens do pedido
      const itensList = Object.entries(itemQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([cardapioId, quantidade]) => {
          const itemInfo = getItemInfo(cardapioId);
          console.log(`Item ${cardapioId}:`, { quantidade, valor: itemInfo?.valor });
          return {
            pedido_id: pedidoId,
            cardapio_id: parseInt(cardapioId),
            quantidade: quantidade,
            preco_unit: itemInfo ? parseFloat(itemInfo.valor) : 0,
          };
        });

      console.log("Enviando itens:", itensList);

      // Enviar itens do pedido em paralelo para melhor performance
      const itensPromises = itensList.map(item => 
        axios.post(
          `http://localhost:3331/pedidos/${pedidoId}/itens`,
          item,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      await Promise.all(itensPromises);
      
      alert("Pedido confirmado com sucesso!");
      setItemQuantities({});
      setConfirmando(false);
      
      navigate("/mesas");
      
    } catch (erro) {
      setConfirmando(false);
      console.error("❌ Erro ao confirmar pedido:", erro);
      console.error("Status:", erro.response?.status);
      console.error("Dados erro:", erro.response?.data);
      console.error("Mensagem:", erro.message);
      
      const mensagem = erro.response?.data?.message || 
                      erro.response?.data?.error || 
                      erro.message ||
                      "Erro ao confirmar pedido. Tente novamente.";
      setError(mensagem);
    }
  };

  const handleRemoveItem = (itemKey) => {
    setItemQuantities((prev) => {
      const updated = { ...prev };
      delete updated[itemKey];
      return updated;
    });
  };

  const totalItems = Object.values(itemQuantities).reduce((a, b) => a + b, 0);

  // Organizar itens selecionados por categoria
  const groupedPedidos = Object.entries(itemQuantities)
    .filter(([_, qty]) => qty > 0)
    .reduce((acc, [itemKey, qty]) => {
      const categoria = "Meus Itens";
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push({ itemKey, quantidade: qty });
      return acc;
    }, {});

  return (
    <div className="pedidos-page">
      <div className="pedidos-container">
        <div className="pedidos-top">
          <header className="pedidos-header">
            <div className="pedidos-brand">
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
            <Link to={`/cardapio?mesaId=${mesaId}`} className="longout">
              <h3 className="longout" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                Voltar
                <img
                  src={longout}
                  alt="Voltar"
                  style={{ width: "28px", height: "auto" }}
                />
              </h3>
            </Link>
          </div>
        </div>

        <h1 className="pedidos-title">PEDIDOS MESA {mesaId}</h1>

        <div className="pedidos-list">
          {loading && <div className="pedidos-message">Carregando pedidos...</div>}
          {error && <div className="pedidos-error">{error}</div>}
          {!loading && !error && totalItems === 0 && (
            <div className="pedidos-message">
              Nenhum item selecionado. Volte ao cardápio para escolher itens.
            </div>
          )}

          {Object.entries(groupedPedidos).map(([categoria, items]) => (
            <div key={categoria} className="pedidos-section">
              <h2 className="pedidos-section-title">{categoria}</h2>
              <div className="pedidos-items">
                {items.map((item) => {
                  const itemInfo = getItemInfo(item.itemKey);
                  return (
                    <div key={item.itemKey} className="pedido-item">
                      <div className="pedido-info">
                        <span className="pedido-name">
                          {itemInfo ? itemInfo.nome : "Item desconhecido"}
                        </span>
                        <span className="pedido-quantity">
                          Quantidade: <strong>{item.quantidade}</strong>
                        </span>
                        {itemInfo && (
                          <span className="pedido-price">
                            R$ {(parseFloat(itemInfo.valor) * item.quantidade).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-remove-item"
                        onClick={() => handleRemoveItem(item.itemKey)}
                        title="Remover item"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="pedidos-footer">
          <button 
            className="btn-confirm-order" 
            type="button"
            onClick={handleConfirmOrder}
            disabled={confirmando}
          >
            {confirmando ? "CONFIRMANDO..." : "CONFIRMAR PEDIDO"}
            <span className="order-badge">{totalItems}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Pedidos;
