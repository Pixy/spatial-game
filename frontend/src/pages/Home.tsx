import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';

const levels = [
  { id: "easy", label: "Niveau Facile", className: "easy" },
  { id: "medium", label: "Niveau Moyen", className: "medium" },
  { id: "hard", label: "Niveau Difficile", className: "hard" },
  { id: "free", label: "Mode Libre", className: "free" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLevelSelect = (level: string) => {
    navigate(`/gameplay?level=${level}`);
  };

  return (  
    <div className="home-container">
      <h1 className="home-title">Choisissez un Niveau de Jeu</h1>
      <p className="home-description">
        Testez vos compétences avec nos niveaux de jeu soigneusement conçus. Que vous soyez débutant ou expert, il y a un défi pour vous !
      </p>
      {levels.map((level) => (
        <button
          key={level.id}
          className={`level-button ${level.className}`}
          onClick={() => handleLevelSelect(level.id)}
        >
          {level.label}
        </button>
      ))}
    </div>    
  );
};

export default Home;
