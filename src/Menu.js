import React from "react";

const items = [
  "Accueil",
  "Progression",
  "Formation",
  "Simulateur",
  "Statistiques",
  "Profile",
];

export default function Menu({ value, setValue }) {
  return (
    <div
      style={{
        background: "#1d2240",
        width: 180,
        color: "#fff",
        minHeight: "100vh",
        paddingTop: 40,
        boxShadow: "2px 0 12px #0002",
      }}
    >
      {items.map((label, i) => (
        <div
          key={label}
          style={{
            padding: "18px 24px",
            cursor: "pointer",
            background: value === i ? "#4361ff" : "none",
            fontWeight: value === i ? "bold" : "normal",
            fontSize: 17,
            borderRadius: "0 20px 20px 0",
            marginBottom: 2,
            transition: "background 0.2s",
          }}
          onClick={() => setValue(i)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
