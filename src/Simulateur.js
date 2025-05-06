import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const COINS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "SOL", name: "Solana" },
];

const PERIODS = [
  { key: "day", label: "Jour" },
  { key: "month", label: "Mois" },
  { key: "year", label: "Année" },
];

function generateFakePrices(start, count, volatility = 3, baseStep = 0.1) {
  let arr = [start];
  for (let i = 1; i < count; ++i) {
    let prev = arr[i - 1];
    let move =
      (Math.random() - 0.5) * volatility +
      baseStep * (Math.random() > 0.5 ? 1 : -1);
    arr.push(Math.max(0.1, prev + move));
  }
  return arr.map((v) => Math.round(v * 100) / 100);
}

function getLabels(period) {
  if (period === "day") {
    return [
      "9h",
      "10h",
      "11h",
      "12h",
      "13h",
      "14h",
      "15h",
      "16h",
      "17h",
      "18h",
      "19h",
    ];
  }
  if (period === "month") {
    const days = 30;
    const month = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jui",
      "Jui",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ][new Date().getMonth()];
    return Array.from({ length: days }, (_, i) => `${i + 1} ${month}`);
  }
  if (period === "year") {
    return [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
  }
}

const FEES_PCT = 0.001; // 0.1% frais par trade

export default function Simulateur() {
  // Etats principaux
  const [coin, setCoin] = useState("BTC");
  const [period, setPeriod] = useState("day");
  const [montant, setMontant] = useState(""); // en euros à trader
  const [sens, setSens] = useState("achat");

  // Gestion portefeuille
  const [capital, setCapital] = useState(1000); // solde euros
  const [crypto, setCrypto] = useState(0); // solde pièce
  const [tradeIndex, setTradeIndex] = useState(0);

  // Historique des trades
  const [trades, setTrades] = useState([]);

  const labels = useMemo(() => getLabels(period), [period]);
  const prices = useMemo(() => {
    // Générer prix réaliste selon coin, période
    let base =
      coin === "BTC"
        ? 30000
        : coin === "ETH"
        ? 2000
        : coin === "BNB"
        ? 400
        : 100;
    let volatil = coin === "BTC" ? 350 : coin === "ETH" ? 25 : 9;
    let count = labels.length;
    return generateFakePrices(base, count, volatil);
  }, [coin, period, labels.length]);

  // Reset complet si coin/période change
  useEffect(() => {
    setTradeIndex(0);
    setTrades([]);
    setCapital(1000);
    setCrypto(0);
  }, [coin, period]);

  // Calcul performance portefeuille
  const portefValue = useMemo(
    () => capital + crypto * prices[tradeIndex],
    [capital, crypto, prices, tradeIndex]
  );
  const perfRel = useMemo(
    () => (((portefValue - 1000) / 1000) * 100).toFixed(2) + " %",
    [portefValue]
  );

  // Pour indiquer visuellement les trades succès/échec sur la courbe
  const tradePoints = useMemo(() => {
    return trades.map((t) => ({
      x: t.index,
      y: t.priceBuy,
      backgroundColor: t.success ? "#4ade80" : "#fb6363",
      radius: 7,
    }));
  }, [trades]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: `Cours ${coin}`,
          data: prices,
          borderColor: "#78e896",
          backgroundColor: "rgba(68,241,110,0.09)",
          pointRadius: prices.map((val, i) => (i === tradeIndex ? 7 : 3)),
          pointBackgroundColor: prices.map((val, i) =>
            i === tradeIndex ? "#ffd566" : "#3c88cb"
          ),
          tension: 0.3,
          borderWidth: 2,
        },
        // Affiche succès/échec "trade"
        {
          type: "scatter",
          data: tradePoints,
          label: "Trades",
          pointStyle: trades.map((t) => (t.success ? "circle" : "rectRot")),
          pointBorderColor: trades.map((t) =>
            t.success ? "#40e351" : "#fd3b3b"
          ),
          pointBorderWidth: 2,
          showLine: false,
          datalabels: { display: false },
        },
      ],
    }),
    [prices, coin, tradeIndex, trades, tradePoints, labels]
  );

  const options = useMemo(
    () => ({
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 0) {
                return `Cours : ${ctx.formattedValue} €`;
              }
              if (ctx.datasetIndex === 1 && trades[ctx.dataIndex]) {
                const t = trades[ctx.dataIndex];
                return `${t.sens === "achat" ? "🟢 Achat" : "🔴 Vente"} : ${
                  t.qtyCrypto?.toFixed(5) || ""
                } à ${t.priceBuy} €, P&L : ${t.gain.toFixed(2)} €`;
              }
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true },
        y: { display: true },
      },
    }),
    [trades]
  );

  // TRADE LOGIQUE
  const [message, setMessage] = useState("");
  function jouer() {
    setMessage("");
    if (tradeIndex >= prices.length - 1) {
      setMessage(
        "Fin de la simulation pour cette série. Change période/crypto !"
      );
      return;
    }
    const prixA = prices[tradeIndex];
    const prixB = prices[tradeIndex + 1];

    const amount = parseFloat(montant);
    if (!amount || amount <= 0) {
      setMessage("⚡ Mets un montant > 0 € !");
      return;
    }
    let nextEuros = capital;
    let nextCrypto = crypto;
    let qtyCrypto = 0,
      gain = 0,
      pnl = 0;

    // FRAIS calcul
    const fees = Math.max(0.01, amount * FEES_PCT);

    if (sens === "achat") {
      if (capital < amount + fees) {
        setMessage("Pas assez de capital.");
        return;
      }
      // Achat = On achète pour X € au prix spot, puis on verra, et on peut revendre le lendemain
      qtyCrypto = (amount - fees) / prixA;
      let sellValue = qtyCrypto * prixB;
      gain = sellValue - amount; // nb: frais uniquement sur achat ici
      pnl = gain;
      nextEuros = capital - amount;
      nextCrypto = crypto + qtyCrypto;
    } else {
      // Vente, on doit posséder la crypto à vendre !
      const maxQty = crypto * prixA; // valeur euro dispo à la vente
      if (maxQty < amount) {
        setMessage("Pas assez de crypto pour cette vente !");
        return;
      }
      qtyCrypto = (amount - fees) / prixA;
      let buyBackValue = qtyCrypto * prixB;
      gain = amount - buyBackValue; // on gagne si prix baisse
      pnl = gain;
      nextEuros = capital + amount;
      nextCrypto = crypto - qtyCrypto;
    }

    // Succès/échec
    const success =
      (sens === "achat" && prixB > prixA) ||
      (sens === "vente" && prixB < prixA);

    // Enregistrement du trade
    setTrades([
      ...trades,
      {
        index: tradeIndex,
        sens,
        amount,
        qtyCrypto,
        priceBuy: prixA,
        priceSell: prixB,
        fees,
        gain,
        pnl,
        success,
        capitalBefore: capital,
        capitalAfter: nextEuros,
        cryptoBefore: crypto,
        cryptoAfter: nextCrypto,
      },
    ]);
    setMessage(
      success
        ? `🏆 ${
            sens === "achat" ? "Bonne prédiction" : "Short gagnant"
          } ! Gain : ${gain.toFixed(2)} €`
        : `🤕 Mauvaise prédiction. Perte/P&L : ${gain.toFixed(2)} €`
    );
    setCapital(Number(nextEuros));
    setCrypto(Number(nextCrypto));
    setTradeIndex(tradeIndex + 1);
    setMontant(""); // reset montant input
  }

  function resetAll() {
    setCapital(1000);
    setCrypto(0);
    setTradeIndex(0);
    setTrades([]);
    setMessage("");
    setMontant("");
  }

  // pour test rapido : all-in/perso/1/4 capital
  function setMontantAuto(type) {
    if (type === "all") setMontant(Math.floor(capital));
    else if (type === "quarter")
      setMontant(Math.max(1, Math.floor(capital / 4)));
    else if (type === "cryptoMax")
      setMontant((crypto * prices[tradeIndex]).toFixed(2));
  }

  return (
    <div
      style={{
        padding: 26,
        color: "#fff",
        background: "#172044",
        borderRadius: 14,
        maxWidth: 540,
        margin: "30px auto",
        boxShadow: "0 4px 18px #0003",
      }}
    >
      <h2 style={{ color: "#87ff5e", margin: "18px 0 6px" }}>
        Simulateur de Trade (version avancée)
      </h2>
      {/* Sélection crypto - période */}
      <div
        style={{ display: "flex", gap: 17, flexWrap: "wrap", marginBottom: 18 }}
      >
        <select value={coin} onChange={(e) => setCoin(e.target.value)}>
          {COINS.map((c) => (
            <option key={c.symbol} value={c.symbol}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          {PERIODS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          style={{
            marginLeft: 15,
            color: "#fff",
            background: "#453cae",
            border: "none",
            borderRadius: 7,
            padding: "6px 13px",
          }}
          onClick={resetAll}
        >
          🔄 Reset Simulation
        </button>
      </div>

      {/* Courbe */}
      <div
        style={{
          background: "#21297c",
          borderRadius: 12,
          padding: "9px 0",
          marginBottom: 13,
          height: 280,
        }}
      >
        <Line data={data} options={options} height={250} />
      </div>
      {/* Info simulation */}
      <div style={{ marginBottom: 8, color: "#83c8ff" }}>
        Prix actuel ({labels[tradeIndex]}) : <b>{prices[tradeIndex]} €</b>
        {tradeIndex < prices.length - 1 && (
          <>
            {" "}
            → prix suivant : <b>{prices[tradeIndex + 1]} €</b>
          </>
        )}
      </div>
      <div style={{ color: "#92e080", marginBottom: 6 }}>
        Solde : <b>{capital.toFixed(2)} €</b> &nbsp;
        {crypto > 0 && (
          <>
            / {crypto.toFixed(5)} {coin} (
            <b>{(crypto * prices[tradeIndex]).toFixed(2)} €</b>)
          </>
        )}
      </div>
      <div style={{ color: "#ffc866", marginBottom: 8 }}>
        Valeur totale portefeuille : <b>{portefValue.toFixed(2)} €</b> &nbsp;
        <span
          style={{ color: perfRel.startsWith("-") ? "#ff7886" : "#98ffb1" }}
        >
          ({perfRel})
        </span>
      </div>
      {/* Panneau order */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          gap: 12,
        }}
      >
        <label>Sens du trade :</label>
        <select value={sens} onChange={(e) => setSens(e.target.value)}>
          <option value="achat">Achat</option>
          <option value="vente">Vente</option>
        </select>
        {sens === "achat" && (
          <button onClick={() => setMontantAuto("all")}>All-in 💎</button>
        )}
        {sens === "achat" && (
          <button onClick={() => setMontantAuto("quarter")}>1/4 capital</button>
        )}
        {sens === "vente" && (
          <button onClick={() => setMontantAuto("cryptoMax")}>
            Tout vendre
          </button>
        )}
      </div>
      <div>
        <label>
          Montant{" "}
          {sens === "achat"
            ? "en €"
            : `en € (max ${(crypto * prices[tradeIndex]).toFixed(2)})`}
           :{" "}
        </label>
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          style={{
            width: 80,
            marginLeft: 10,
            background: "#232754",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 7px",
          }}
          min={1}
        />
         €
        <button
          onClick={jouer}
          style={{
            marginLeft: 18,
            padding: "6px 14px",
            background: "#4361ff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            opacity: tradeIndex >= prices.length - 1 ? 0.5 : 1,
            cursor: tradeIndex >= prices.length - 1 ? "not-allowed" : "pointer",
          }}
          disabled={tradeIndex >= prices.length - 1}
        >
          Trade
        </button>
      </div>
      <div style={{ marginTop: 13, color: "#ffea71", minHeight: 32 }}>
        {message}
      </div>
      {tradeIndex >= prices.length - 1 && (
        <div style={{ color: "#dd555f", fontWeight: 600, marginTop: 6 }}>
          Fin de la courbe ! Change crypto/période pour recommencer.
        </div>
      )}

      {/* ==================== HISTORIQUE ======================== */}
      <h4 style={{ color: "#beffec", marginTop: 28 }}>Historique des trades</h4>
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          background: "#1b2344",
          borderRadius: 8,
          padding: 10,
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {trades.length === 0 && (
          <div style={{ color: "#7080a7" }}>Aucun trade effectué.</div>
        )}
        {trades.map((t, i) => (
          <div
            key={i}
            style={{
              marginBottom: 6,
              color: t.success ? "#adf7c8" : "#ff888e",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: "1em" }}>
              {t.sens === "achat" ? "🟢 Achat" : "🔴 Vente"}
            </span>
            au {labels[t.index]} &nbsp;à <b>{t.priceBuy} €</b>
            <span>Montant : {t.amount} €</span>
            <span>Quantité : {t.qtyCrypto?.toFixed(5) || ""}</span>
            <span>
              | Rendement : <b>{t.gain.toFixed(2)} €</b>
            </span>
            <span>
              | Capital: <b>{t.capitalAfter.toFixed(2)} €</b>
            </span>
            {t.success ? (
              <span style={{ color: "#f6ff90" }}>✅</span>
            ) : (
              <span style={{ color: "#fe9b8a" }}>❌</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ color: "#728be7", fontSize: "0.95em" }}>
        Frais simulés : {(FEES_PCT * 100).toFixed(2)}% par trade
      </div>
    </div>
  );
}
