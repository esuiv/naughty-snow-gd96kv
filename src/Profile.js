import React, { useState, useEffect } from "react";

export default function Profile() {
  const [pseudo, setPseudo] = useState("TraderNoob");
  const [avatar, setAvatar] = useState("🧢");
  const [edit, setEdit] = useState(false);

  // Liste d'emojis
  const avatars = ["🧢", "🤓", "🚀", "🎩", "🐺", "👸", "👨‍💻", "🦸‍♂️", "🧙‍♂️"];
  const visibleCount = 5; // combien visibles

  // Index de base pour slide
  const [startIndex, setStartIndex] = useState(0);

  // Chargement profil localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem("trading-profile");
    if (saved) {
      const obj = JSON.parse(saved);
      if (obj.pseudo) setPseudo(obj.pseudo);
      if (obj.avatar) setAvatar(obj.avatar);
    }
  }, []);

  // Sauvegarde auto
  useEffect(() => {
    window.localStorage.setItem(
      "trading-profile",
      JSON.stringify({ pseudo, avatar })
    );
  }, [pseudo, avatar]);

  const handleReset = () => {
    if (
      window.confirm(
        "Es-tu sûr de vouloir réinitialiser ton profil ? Cette action est irréversible."
      )
    ) {
      setPseudo("TraderNoob");
      setAvatar("🧢");
      window.localStorage.removeItem("trading-profile");
      setEdit(false);
      setStartIndex(0);
    }
  };

  // Fonctions scroll
  function handlePrev() {
    setStartIndex((i) => Math.max(0, i - 1));
  }
  function handleNext() {
    setStartIndex((i) => Math.min(i + 1, avatars.length - visibleCount));
  }

  // On disable le bouton s'il ne peut pas scroller
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex < avatars.length - visibleCount;

  // Les avatars à afficher
  const visibleAvatars = avatars.slice(startIndex, startIndex + visibleCount);

  return (
    <div
      style={{
        background: "#232754",
        color: "#fff",
        borderRadius: 12,
        padding: 35,
        maxWidth: 380,
      }}
    >
      <h2 style={{ color: "#87ff5e" }}>Mon Profil</h2>
      <div style={{ fontSize: 70, margin: "20px 0" }}>{avatar}</div>
      {edit ? (
        <>
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #87ff5e",
              fontSize: 18,
              marginBottom: 12,
              width: "90%",
            }}
          />
          <div>Sélectionne ton avatar :</div>
          {/* Barre d'avatars défilable */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              margin: "10px 0 18px 0",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Bouton précédent */}
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft}
              style={{
                fontSize: 24,
                background: "transparent",
                color: canScrollLeft ? "#87ff5e" : "#555c",
                border: "none",
                cursor: canScrollLeft ? "pointer" : "not-allowed",
                padding: "0 5px",
                userSelect: "none",
                outline: "none",
                opacity: canScrollLeft ? "1" : "0.5",
              }}
              aria-label="Défiler vers la gauche"
            >
              {"<"}
            </button>
            <div
              style={{
                display: "flex",
                gap: 9,
                overflow: "hidden",
              }}
            >
              {visibleAvatars.map((a, i) => (
                <span
                  key={startIndex + i}
                  style={{
                    fontSize: 32,
                    cursor: "pointer",
                    border:
                      avatar === a
                        ? "2px solid #87ff5e"
                        : "2px solid transparent",
                    borderRadius: "50%",
                    padding: "4px 2px",
                    background: "#222",
                    minWidth: 38,
                    textAlign: "center",
                  }}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </span>
              ))}
            </div>
            {/* Bouton suivant */}
            <button
              onClick={handleNext}
              disabled={!canScrollRight}
              style={{
                fontSize: 24,
                background: "transparent",
                color: canScrollRight ? "#87ff5e" : "#555c",
                border: "none",
                cursor: canScrollRight ? "pointer" : "not-allowed",
                padding: "0 5px",
                userSelect: "none",
                outline: "none",
                opacity: canScrollRight ? "1" : "0.5",
              }}
              aria-label="Défiler vers la droite"
            >
              {">"}
            </button>
          </div>
          <button
            onClick={() => setEdit(false)}
            style={{
              padding: "7px 20px",
              background: "#87ff5e",
              color: "#232754",
              border: "none",
              borderRadius: 7,
              fontWeight: 700,
              marginRight: 12,
            }}
          >
            Valider
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "7px 17px",
              background: "#ff8484",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontWeight: 700,
              marginTop: 10,
            }}
          >
            🗑️ Réinitialiser
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 22, margin: "13px 0 26px 0" }}>
            <b>{pseudo}</b>
          </div>
          <button
            onClick={() => setEdit(true)}
            style={{
              padding: "7px 17px",
              background: "#4361ff",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontWeight: 700,
              marginRight: 12,
            }}
          >
            Modifier
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "7px 17px",
              background: "#ff8484",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontWeight: 700,
            }}
          >
            🗑️ Réinitialiser
          </button>
        </>
      )}
    </div>
  );
}
