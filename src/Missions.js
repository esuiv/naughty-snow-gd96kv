import React, { useState } from "react";

const missions = [
  "Faire un trade gagnant.",
  "Répondre à 1 quiz formation.",
  "Atteindre un palier supérieur.",
  "Perdre moins de 50 € aujourd’hui (simu).",
  "Partager ton résultat à un ami."
];

export default function Missions() {
  const [fait, setFait] = useState(false);
  // Change la mission du jour à chaque refresh (facile, “aléatoire”)
  const missionJour = missions[Math.floor(Math.random() * missions.length)];

  return (
    <div style={{ padding: 30, color: "#fff", background: "#273060", borderRadius: 14, maxWidth: 370 }}>
      <h2 style={{ color: "#7eeefd" }}>Mission du Jour 🚀</h2>
      <div style={{ margin: "18px 0", fontSize: 18 }}>
        {fait ? <span style={{ color: "#87ff5e" }}>🎉 Mission accomplie !</span> :
          <span>{missionJour}</span>}
      </div>
      {!fait &&
        <button
          onClick={() => setFait(true)}
          style={{ padding: "8px 18px", borderRadius: 8, background: "#87ff5e", color: "#141b2b", fontWeight: "bold", border: "none" }}
        >Je valide !</button>
      }
    </div>
  );
}

