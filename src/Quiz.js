import React, { useState } from "react";

const question = {
  q: "Qu’est-ce qu’un stop-loss ?",
  options: [
    "Une technique pour gagner plus vite en trading",
    "Un ordre pour limiter les pertes sur un trade",
    "Un prix plancher pour acheter une action",
  ],
  correct: 1,
};

export default function Quiz() {
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState("");

  function handleAnswer(idx) {
    if (idx === question.correct) {
      setResult("✅ Bonne réponse !");
    } else {
      setResult("❌ Mauvaise réponse.");
    }
    setAnswered(true);
  }

  return (
    <div
      style={{
        background: "#101332",
        color: "#fff",
        borderRadius: 12,
        padding: 30,
        maxWidth: 370,
      }}
    >
      <h2>Quiz Formation 🧑‍🎓</h2>
      <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
        {question.q}
      </div>
      {question.options.map((rep, i) => (
        <div key={i}>
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: 10,
              margin: "5px 0",
              borderRadius: 7,
              border: "1px solid #4361ff",
              background: answered ? "#22263c" : "#273660",
              color: "#fff",
              cursor: answered ? "not-allowed" : "pointer",
              opacity: answered ? 0.6 : 1,
            }}
            onClick={() => !answered && handleAnswer(i)}
            disabled={answered}
          >
            {rep}
          </button>
        </div>
      ))}
      {answered && (
        <div style={{ marginTop: 18, fontWeight: 700 }}>{result}</div>
      )}
    </div>
  );
}
