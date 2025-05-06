import React, { useState } from "react";
import Menu from "./Menu";
import Missions from "./Missions";
import Profile from "./Profile";
import Simulateur from "./Simulateur";
import Quiz from "./Quiz";
import Statistiques from "./Statistiques";

// === Ton code de paliers, inchangé ! ===
const PALIER_LIST = [
  { name: "Larve", min: 1, max: 5, icon: "🐛" },
  { name: "Noob", min: 5, max: 10, icon: "🥚" },
  { name: "Apprenti", min: 10, max: 25, icon: "📚" },
  { name: "Débutant", min: 25, max: 50, icon: "👶" },
  { name: "Bricoleur", min: 50, max: 100, icon: "🔨" },
  { name: "Petit Joueur", min: 100, max: 250, icon: "🧒" },
  { name: "Curieux", min: 250, max: 500, icon: "🤔" },
  { name: "Junior Trader", min: 500, max: 1000, icon: "💹" },
  { name: "Testeur", min: 1000, max: 2500, icon: "🧪" },
  { name: "Aventurier", min: 2500, max: 5000, icon: "🏕" },
  { name: "Semi-Pro", min: 5000, max: 10000, icon: "🏅" },
  { name: "Compétiteur", min: 10000, max: 25000, icon: "🏆" },
  { name: "Stratège", min: 25000, max: 50000, icon: "♟️" },
  { name: "Trader Confirmé", min: 50000, max: 100000, icon: "💼" },
  { name: "Pro", min: 100000, max: 250000, icon: "🧑‍💻" },
  { name: "Expert", min: 250000, max: 400000, icon: "🧠" },
  { name: "Sensei", min: 400000, max: 600000, icon: "🥋" },
  { name: "Maître", min: 600000, max: 800000, icon: "🧙" },
  { name: "Légende", min: 800000, max: 1000000, icon: "🦄" },
  { name: "Dieu du Trading", min: 1000000, max: Infinity, icon: "👑⚡️" },
];

function findPalier(value) {
  return (
    PALIER_LIST.find((p) => value >= p.min && value < p.max) ||
    PALIER_LIST[PALIER_LIST.length - 1]
  );
}

// =====================
// APPLI COMPLÈTE AVEC MENU
// =====================
export default function App() {
  const [page, setPage] = useState(0);
  const [montant, setMontant] = useState(1);

  // ton code pour progresser dans les paliers
  const palier = findPalier(montant);
  const currentIndex = PALIER_LIST.indexOf(palier);
  const nextPalier = PALIER_LIST[currentIndex + 1];
  const percent = Math.min(
    ((Math.log10(montant) - Math.log10(1)) /
      (Math.log10(1000000) - Math.log10(1))) *
      100,
    100
  );

  return (
    <div style={{ display: "flex" }}>
      <Menu value={page} setValue={setPage} />
      <div
        style={{
          flex: 1,
          background: "#0f1320",
          minHeight: "100vh",
          padding: 32,
        }}
      >
        {page === 0 && (
          <div>
            {/* ACCUEIL : Mission + Progression */}
            <h1 style={{ color: "#fff" }}>🏦 Trader Quest</h1>
            <Missions />
            {/* -- Ici ton code de progression (le gros bloc) -- */}
            {/* ---------- Copier/coller ton code ici ---------- */}
            <div style={{ marginBottom: 30, maxWidth: 500 }}>
              <label>
                <b>Montant : </b>
                <input
                  type="number"
                  min={1}
                  max={1000000}
                  value={montant}
                  step="1"
                  onChange={(e) => setMontant(Number(e.target.value))}
                  style={{
                    fontSize: 20,
                    padding: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: 6,
                  }}
                />
                €
              </label>
              <input
                type="range"
                min={1}
                max={1000000}
                step={montant < 10000 ? 1 : 1000}
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                style={{ width: 300, marginLeft: 20, verticalAlign: "middle" }}
              />
            </div>
            <div
              style={{
                background: "#222947",
                padding: 20,
                borderRadius: 16,
                marginBottom: 30,
                maxWidth: 520,
                boxShadow: "0 2px 8px #06081b",
              }}
            >
              <h2 style={{ fontSize: "2em", margin: "0.3em 0" }}>
                {palier.icon}&nbsp;{" "}
                <span style={{ color: "#87ff5e" }}>{palier.name}</span>
              </h2>
              <div>
                <b>Gains : </b>
                <span style={{ color: "#fff", fontSize: "1.2em" }}>
                  {montant} €
                </span>
              </div>
              <div>
                <b>Palier : </b>
                {palier.min} € {" - "}
                {palier.max === Infinity ? "∞" : palier.max + " €"}
              </div>
              {nextPalier && (
                <div style={{ marginTop: 5 }}>
                  <b>À débloquer : </b>
                  <span>
                    {nextPalier.icon} <b>{nextPalier.name}</b>&nbsp;(
                    {nextPalier.min}
                    €)
                  </span>
                  <br />
                  <small>
                    Encore{" "}
                    <span style={{ color: "#ffad4a" }}>
                      {nextPalier.min - montant}€
                    </span>{" "}
                    à gagner !
                  </small>
                </div>
              )}
            </div>
            {/* Progression */}
            <div style={{ marginBottom: 35, maxWidth: 500 }}>
              <div style={{ marginBottom: 8 }}>
                <b>Progression vers le million :</b>
              </div>
              <div
                style={{
                  height: 22,
                  width: "100%",
                  background: "#181d30",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: percent + "%",
                    background:
                      "linear-gradient(90deg, #87ff5e 40%, #7eeefd 90%)",
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div style={{ fontSize: 13, color: "#aaa" }}>
                {percent.toFixed(1)}% de la quête accompli !
              </div>
            </div>
            {/* Liste des paliers */}
            <div style={{ maxWidth: 650, margin: "0 auto" }}>
              <h3>Liste des Rangs :</h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px 18px",
                  fontSize: 18,
                }}
              >
                {PALIER_LIST.map((p, i) => (
                  <li
                    key={p.name}
                    style={{
                      background: i <= currentIndex ? "#4361ff" : "#191e35",
                      color: i === currentIndex ? "#87ff5e" : "#fff",
                      border:
                        i === currentIndex
                          ? "2px solid #87ff5e"
                          : "2px solid transparent",
                      borderRadius: 16,
                      padding: "7px 18px",
                      opacity: i <= currentIndex ? 1 : 0.48,
                      fontWeight: i === currentIndex ? 900 : 400,
                      boxShadow:
                        i === currentIndex ? "0 0 10px #87ff5e88" : undefined,
                    }}
                  >
                    {p.icon} <b>{p.name}</b>
                    <span style={{ fontSize: 13, marginLeft: 10 }}>
                      ({p.min}€ - {p.max === Infinity ? "∞" : p.max + "€"})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* ----------- FIN de ton code -------------- */}
          </div>
        )}

        {page === 3 && <Simulateur />}
        {page === 5 && <Profile />}
        {page === 4 && <Statistiques />}
        {page === 1 && <Missions />}
        {page === 2 && <Quiz />}
      </div>
    </div>
  );
}
