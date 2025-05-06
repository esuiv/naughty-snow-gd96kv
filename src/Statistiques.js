import React from "react";

export default function Statistiques() {
  // Fait simple, fixe. Tu peux relier à "capital" du simulateur plus tard.
  return (
    <div
      style={{
        background: "#1c2d56",
        color: "#fff",
        borderRadius: 12,
        padding: 32,
        maxWidth: 400,
      }}
    >
      <h2 style={{ color: "#87ff5e" }}>Statistiques</h2>
      <ul style={{ fontSize: 18, marginTop: 21, lineHeight: "200%" }}>
        <li>
          Trades tentés : <b style={{ color: "#7eeefd" }}>8</b>
        </li>
        <li>
          Trades gagnants : <b style={{ color: "#52ffb8" }}>5</b>
        </li>
        <li>
          Capital fictif actuel : <b style={{ color: "#ffea71" }}>1320 €</b>
        </li>
        <li>
          Missions accomplies : <b style={{ color: "#87ff5e" }}>3</b>
        </li>
        <li>
          Niveau : <b style={{ color: "#87ff5e" }}>Bricoleur</b>
        </li>
      </ul>
    </div>
  );
}
